import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeesService } from './Services/employees.service';
import { provideHttpClient } from '@angular/common/http';
import { BaseChartDirective} from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BaseChartDirective
  ],
  providers: [provideHttpClient(),EmployeesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
