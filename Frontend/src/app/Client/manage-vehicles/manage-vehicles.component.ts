import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

// Importez ici vos composants partagés et le service
import { NewvehiculeComponent } from './components/newvehicule/newvehicule.component';
import { VehiculeService, Vehicule } from '../../Services/vehicule.service';
import { NavClientComponent } from "../../Commun/nav-client/nav-client.component";

@Component({
  selector: 'app-manage-vehicles',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, NavClientComponent],
  templateUrl: './manage-vehicles.component.html',
  styleUrls: ['./manage-vehicles.component.css']
})
export class ManageVehiclesComponent {
  vehicules: Vehicule[] = [];

  constructor(
    private vehiculeService: VehiculeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadVehicules();
  }

  // Ouvre la modale de création de véhicule
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(NewvehiculeComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVehicules();
      }
    });
  }

  // Récupère la liste des véhicules depuis le backend
  loadVehicules(): void {
    this.vehiculeService.getVehicules().subscribe((response: any) => {
      // On suppose que la réponse contient un tableau dans response.data
      this.vehicules = response.data;
    });
  }

  // Ouvre la modale en mode édition avec les données du véhicule sélectionné
  editVehicule(vehicule: Vehicule): void {
    const dialogRef = this.dialog.open(NewvehiculeComponent, {
      width: '600px',
      data: vehicule
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVehicules();
      }
    });
  }

  // Supprime un véhicule
  deleteVehicule(id: string): void {
    this.vehiculeService.deleteVehicule(id).subscribe(
      () => {
        this.loadVehicules();
        Swal.fire({
          title: 'Supprimé!',
          text: 'Le véhicule a été supprimé avec succès.',
          icon: 'success'
        });
      },
      error => {
        Swal.fire({
          title: 'Échec de la suppression!',
          text: 'Le véhicule n\'a pas pu être supprimé.',
          icon: 'error'
        });
      }
    );
  }
}
