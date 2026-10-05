import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

interface RiskBand { band: string; count: number; }
interface Summary {
  totalApplications: number;
  processedToday: number;
  accuracy: number;
  batchDurationMinutes: number;
  riskBands: RiskBand[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
  <main class="container py-4">
    <header class="d-flex flex-wrap justify-content-between align-items-center mb-4">
      <div>
        <p class="eyebrow mb-1">RISK INTELLIGENCE</p>
        <h1 class="h2 mb-1">Credit Risk Analytics</h1>
        <p class="text-secondary mb-0">Accessible portfolio overview · Synthetic demo data</p>
      </div>
      <button class="btn btn-outline-primary mt-3 mt-md-0" (click)="load()" [disabled]="loading"
              aria-label="Refresh analytics data">{{ loading ? 'Refreshing…' : 'Refresh data' }}</button>
    </header>
    <div *ngIf="error" class="alert alert-danger" role="alert">{{ error }}</div>
    <section class="row g-3 mb-4" aria-label="Portfolio summary metrics">
      <div class="col-12 col-md-6 col-xl-3" *ngFor="let metric of metrics">
        <article class="metric-card h-100">
          <p class="text-secondary mb-2">{{ metric.label }}</p>
          <p class="metric-value mb-0">{{ metric.value }}</p>
        </article>
      </div>
    </section>
    <section class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <h2 class="h5">Applications by demo risk band</h2>
        <p class="text-secondary">Counts are illustrative and should not be interpreted as real lending outcomes.</p>
        <div class="table-responsive">
          <table class="table align-middle">
            <caption class="visually-hidden">Application counts grouped by synthetic risk band</caption>
            <thead><tr><th scope="col">Risk band</th><th scope="col" class="text-end">Applications</th><th scope="col">Share</th></tr></thead>
            <tbody>
              <tr *ngFor="let band of summary?.riskBands">
                <th scope="row"><span class="band-dot" [class]="band.band.toLowerCase()"></span>{{ band.band }}</th>
                <td class="text-end">{{ band.count | number }}</td>
                <td><div class="progress" role="progressbar" [attr.aria-label]="band.band + ' share'"
                    [attr.aria-valuenow]="share(band.count)" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar" [style.width.%]="share(band.count)"></div></div></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="small text-secondary mb-0" aria-live="polite">{{ statusMessage }}</p>
      </div>
    </section>
    <footer class="small text-secondary mt-4">Demo only · No personal data · Not a credit decisioning tool</footer>
  </main>`,
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  summary: Summary | null = null;
  loading = false;
  error = '';
  statusMessage = 'Loading analytics…';
  ngOnInit(): void { this.load(); }
  get metrics() {
    const s = this.summary;
    return [
      { label: 'Total records', value: s ? s.totalApplications.toLocaleString() : '—' },
      { label: 'Processed today', value: s ? s.processedToday.toLocaleString() : '—' },
      { label: 'Pipeline accuracy', value: s ? (s.accuracy * 100).toFixed(1) + '%' : '—' },
      { label: 'Batch duration', value: s ? s.batchDurationMinutes + ' min' : '—' },
    ];
  }
  load(): void {
    this.loading = true; this.error = '';
    this.http.get<Summary>(`${environment.apiBaseUrl}/api/analytics/summary`).subscribe({
      next: data => { this.summary = data; this.loading = false; this.statusMessage = 'Analytics updated successfully.'; },
      error: () => { this.error = 'Could not load analytics. Ensure the FastAPI backend is running on port 8000.'; this.loading = false; this.statusMessage = 'Analytics unavailable.'; }
    });
  }
  share(count: number): number {
    const total = this.summary?.riskBands.reduce((sum, item) => sum + item.count, 0) ?? 0;
    return total ? Math.round(count / total * 100) : 0;
  }
}
