/* eslint-disable @typescript-eslint/no-explicit-any */
import { Monthes } from '../Enums/Enums';

/**
 * - Define the configuration for the Promos chart
 * - See {@link https://www.chartjs.org/docs/latest/configuration/}
 */
export class PromosChartConfig {
  private static _data: any = {
    //Getting values on ENUM without filter returns both the keys and default number values. Filter() is required to use only the keys of the enum
    labels: Object.values(Monthes).filter((value) => isNaN(Number(value))),
    datasets: [
      {
        label: 'Promos active par mois',
        //These values should be retrieved from the API
        data: ['3', '12', '7', '9', '16', '3', '8', '10', '2', '8', '1', '3'],
        backgroundColor: '#E4004680',
      },
    ],
  };

  private static _options: any = {
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  //#region  ACCESSORS

  public static get data(): any {
    return PromosChartConfig._data;
  }

  public static get options(): any {
    return PromosChartConfig._options;
  }

  public static get config(): any {
    return PromosChartConfig._config;
  }

  //#endregion

  private static _config: any = {
    type: 'bar',
    data: this.data,
    options: this.options,
  };
}
