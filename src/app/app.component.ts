import { Component, OnInit } from '@angular/core';
import { EmployeesService } from './Services/employees.service';
import { employee } from './model/employee';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables,ChartDataLabels);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  employeesList: employee[] = [];
  newList: { name: string, totalWorkingHours: number }[] = [];
  page: number = 1;
  itemsPerPage: number = 10;
  previousButton: boolean = false;
  nextButton: boolean = true;
  serialNumber: number = 1;


  // Data for the pie chart
  pieChartLabels: string[] = [];
  pieChartData: number[] = [];

  constructor(private employeeService: EmployeesService) { }
  ngOnInit(): void {
    this.GetEmployees();
  }

  GetEmployees() {
    this.employeeService.GetAllEmployees().subscribe(data => {
      this.employeesList = data;
      //console.log(this.employeesList);
      this.newList = this.CalculateWorkHours(this.employeesList);
      //console.log(this.newList);
      this.pieChartLabels = this.newList.map(data => data.name);
      this.pieChartData = this.newList.map(data => data.totalWorkingHours);
      this.RenderCharts();

    }, error => {
      console.log("Error occured when fetching data", error);
    });
  }

  CalculateWorkHours(allEmployees: employee[]): { name: string, totalWorkingHours: number }[] {

    const workingTimes: { [name: string]: number } = {};

    allEmployees.forEach((entry) => {
      const loginTime = new Date(entry.StarTimeUtc).getTime();
      const logoutTime = new Date(entry.EndTimeUtc).getTime();
      const workingHours = (logoutTime - loginTime) / (1000 * 60 * 60);
      if (workingTimes[entry.EmployeeName]) {
        workingTimes[entry.EmployeeName] += workingHours;
      }
      else {
        workingTimes[entry.EmployeeName] = workingHours;
      }
    });

    return Object.keys(workingTimes).map((name) => ({
      name,
      totalWorkingHours: workingTimes[name]
    }));
  }

  generateColors(dataLength: number): string[] {
    const colors: string[] = [];

    for (let i = 0; i < dataLength; i++) {
      const color = `rgb(${this.generateRandomColors(0, 255)},${this.generateRandomColors(0, 255)},${this.generateRandomColors(0, 255)})`;
      colors.push(color);
    }

    return colors;
  }

  generateRandomColors(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



  RenderCharts() {
    const myChart = new Chart("pie-chart", {
      type: 'pie',
      data: {
        labels: this.pieChartLabels,
        datasets: [{
          label: 'My First Dataset',
          data: this.pieChartData,
          backgroundColor: this.generateColors(this.pieChartData.length),
          hoverOffset: 4
        }]
      },
      options:{
        plugins:{
          datalabels:{
            formatter: (value, context) => {
              const data = context?.chart?.data?.datasets?.[0]?.data;
            
              if (Array.isArray(data)) {
                const numericData = data.filter((item): item is number => typeof item === 'number');
                const total = numericData.reduce((a, b) => a + b, 0);
            
                if (total > 0) {
                  const percentage = ((value / total) * 100).toFixed(2) + "%";
                  return percentage;
                }
              }
            
              return null; 
            },
            color: '#fff',
            font: {
              weight: 'bold'
            }
          }
        }
      }
    },
    )
  }

  // Initialize the chart in ngOnInit after the view is loaded


  editButtonClicked() {

  }
}
