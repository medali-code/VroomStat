import { Component, OnInit, OnDestroy } from '@angular/core'; // Import OnDestroy
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { NavAdminComponent } from "../../Commun/nav-admin/nav-admin.component";
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SinistreService, SinistreStatut } from '../../Services/sinistre.service';
import { ClientService, RegisterClientModel } from '../../Services/client.service';
import { AvisService } from '../../Services/avis.service';
import { catchError, map, takeUntil } from 'rxjs/operators'; // Import takeUntil
import { of, forkJoin, Subject } from 'rxjs'; // Import Subject

interface Summary {
  title: string;
  count: number;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule, NavAdminComponent, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy { // Implement OnDestroy
  summaries: Summary[] = [];
  private destroy$ = new Subject<void>(); // RxJS Subject to manage subscriptions

  constructor(
    private fb: FormBuilder,
    private sinistreService: SinistreService,
    private clientService: ClientService,
    private avisService: AvisService,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadDashboardData();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emit a value to signal completion
    this.destroy$.complete(); // Complete the Subject
  }

  loadDashboardData(): void {
    forkJoin({
      validatedSinistres: this.sinistreService.getSinistres().pipe(
        map(response => response.data ? response.data.filter(s => s.statut === SinistreStatut.VALIDE).length : 0),
        catchError(() => of(0))
      ),
      totalClients: this.clientService.getClients().pipe(
        map(clients => clients.length),
        catchError(() => of(0))
      ),
      totalAvis: this.avisService.getAllAvis().pipe(
        map(response => response.data ? response.data.length : 0),
        catchError(() => of(0))
      ),
      totalSinistres: this.sinistreService.getSinistres().pipe(
        map(response => response.data ? response.data.length : 0),
        catchError(() => of(0))
      )
    }).pipe(takeUntil(this.destroy$)).subscribe(({ validatedSinistres, totalClients, totalAvis, totalSinistres }) => {
      this.summaries = [
        {
          title: 'Sinistres Validés',
          count: validatedSinistres,
          icon: 'check_circle_outline',
          link: '/admin/sinistres'
        },
        {
          title: 'Clients',
          count: totalClients,
          icon: 'people',
          link: '/admin/clients'
        },
        {
          title: 'Avis',
          count: totalAvis,
          icon: 'rate_review',
          link: '/admin/avis'
        },
        {
          title: 'Sinistres Totaux',
          count: totalSinistres,
          icon: 'report_problem',
          link: '/admin/sinistres'
        }
      ];
    });
  }
}