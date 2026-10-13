import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('muestra el título y los KPIs de ejemplo', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('VM-Finance');
    expect(el.textContent).toContain('$ 45.408');
    expect(el.textContent).toContain('$ 4.652.444');
  });

  it('indica cuando la API responde', async () => {
    const fixture = TestBed.createComponent(App);
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/health').flush({
      status: 'ok',
      service: 'vm-finance-api',
      version: '0.1.0',
      database: 'not-configured',
      timestamp: new Date().toISOString(),
    });
    await fixture.whenStable();
    fixture.detectChanges();
    const status = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="api-status"]',
    );
    expect(status?.textContent).toContain('API conectada');
  });
});
