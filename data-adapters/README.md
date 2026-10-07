# Big data and storage adapters
- **HDFS:** point Spark input/output at `hdfs:///...` after setting Hadoop configuration.
- **Cassandra:** use the Spark Cassandra connector or a dedicated sink; define partition keys around query patterns and avoid unbounded partitions.
- **SQL Server:** use JDBC with credentials supplied by a secret manager; stage and validate records before publishing aggregates.
- **GCP:** deploy API to Cloud Run or GKE and store analytics artifacts in Cloud Storage; use IAM service identities.
- **Data quality:** add schema validation, duplicate checks, null-rate monitoring, reconciliation counts, and lineage metadata.
