import argparse
from pyspark.sql import SparkSession, functions as F

def main():
    parser = argparse.ArgumentParser(description="Create synthetic credit-risk analytics features")
    parser.add_argument("--input", required=True, help="CSV file path or HDFS URI")
    parser.add_argument("--output", required=True, help="Parquet output path or HDFS URI")
    args = parser.parse_args()

    spark = SparkSession.builder.appName("CreditRiskAnalyticsPipeline").getOrCreate()
    try:
        df = spark.read.option("header", True).option("inferSchema", True).csv(args.input)
        required = {"application_id", "annual_income", "monthly_debt", "requested_amount"}
        missing = required.difference(df.columns)
        if missing:
            raise ValueError(f"Input is missing required columns: {sorted(missing)}")

        clean = (df.dropna(subset=list(required))
            .filter((F.col("annual_income") > 0) &
                    (F.col("monthly_debt") >= 0) &
                    (F.col("requested_amount") > 0))
            .withColumn("annual_debt_to_income",
                        (F.col("monthly_debt") * F.lit(12.0)) / F.col("annual_income"))
            .withColumn("demo_risk_band",
                F.when((F.col("annual_debt_to_income") < 0.20) &
                       (F.col("requested_amount") <= F.col("annual_income") * 0.20), "LOW")
                 .when((F.col("annual_debt_to_income") < 0.40) &
                       (F.col("requested_amount") <= F.col("annual_income") * 0.35), "MEDIUM")
                 .otherwise("HIGH")))
        clean.write.mode("overwrite").parquet(args.output)
        clean.groupBy("demo_risk_band").count().orderBy("demo_risk_band").show()
    finally:
        spark.stop()

if __name__ == "__main__":
    main()
