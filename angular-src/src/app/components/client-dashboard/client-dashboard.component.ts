import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css','./../../app.component.css']
})
export class ClientDashboardComponent implements OnInit {
  // The Client
  private user: any;
  // The ngModel for the Form
  private brand: string;
  private model: string;
  private year: number;
  private licensePlate: string;
  private serial: string;
  private photoLink: string;
  // Vector de Vehiculos
  private vehiculos = [];
  // vector de citas
  private citas = [];

  constructor(
    private api: ApiService,
    private flash: FlashMessagesService 
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user')); // Guardo los datos del usuario
    this.resolverVehiculos();
    this.resolverCitasPedidas();
  }

  // Funciones utilizadas Varias veces

  resolverVehiculos() {
    this.api.buscarCliente({
      userID: this.user.ID
    }).subscribe(clientData => { // Busco al cliente 
      if (clientData.success) { // Pregunto si tuve exito
        this.api.buscarCarros({
          OwnerID: clientData.client.ID
        }).subscribe(cars => { // Si lo tuve busco los carros de eso cliente
          this.vehiculos = cars; // Como es un observable asigno directamente
        });
      } else {
        this.flash.show(clientData.msg, { cssClass: 'custom-alert-danger', timeout: 3000 });
      }
    });
  }

  resolverCitasPedidas() {
    this.api.getCitasPedidas(this.user.ID).subscribe(data => {
      if(data.success) {
        this.citas = data.appoiments;
      } else {
        this.flash.show(data.msg, { cssClass: 'custom-alert-danger', timeout: 3000 });
      }
    });
  }


  // Metodo asincrono
  async registrarCarro() {
    // Subir la foto a un proovedor y recibir el link
    this.photoLink = ''; // await proovedor... 
    const car = {
      brand: this.brand,
      model: this.model,
      year: this.year,
      licensePlate: this.licensePlate,
      serial: this.serial,
      photoLink: this.photoLink,
      active: true, 
      OwnerID: 0
    };
    this.api.buscarCliente({
      userID: this.user.ID
    }).subscribe(data => {
      console.log(data);
      if(data.success) {
        car.OwnerID = data.client.ID;
        this.api.registrarCarro(car).subscribe(dataCar => {
          if (dataCar.success) {
            this.vehiculos.push(dataCar.car);
            this.flash.show("Vehículo registrado correctamete", { cssClass: 'custom-alert-success', timeout: 3000})
          } else {
            this.flash.show(dataCar.msg, { cssClass: 'custom-alert-danger', timeout: 3000 });
          }
        });
      } else {
        this.flash.show(data.msg, { cssClass: 'custom-alert-danger', timeout: 3000 });
      }
    });
  }

  desactivar (serial) {
    if (serial) {
      this.api.desactivarVehiculo({ carSerial: serial}).subscribe(data => {
        if(data.success) {
          this.resolverVehiculos();
        } else {
          this.flash.show(data.msg, { cssClass: 'custom-alert-danger', timeout: 3000});
        }
      });
    } else {
      this.flash.show('Upsss... Hemos tenido un eror :(', { cssClass: 'custom-alert-danger' })
    }
  }

  verHistorial (serial) {
    //TODO: Terminar Ese query es medio yuca jejejejejej
  }

  pedirCita(serial) {
    console.log(serial);
    this.api.pedirCita({
      serial: serial
    }).subscribe(data => {
      if(data.success) {
        this.citas.push(data.appoiment);
        this.flash.show('Su solicitud de cita fue elaborada de manera correcta', { cssClass: 'custom-alert-success', timeout: 3000 });
      } else {
        this.flash.show(data.msg, { cssClass: 'custom-alert-danger' }); 
      }
    });
  }

}
