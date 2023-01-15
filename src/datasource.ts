import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';
import odbc from 'odbc';


import { MyQuery, MyDataSourceOptions} from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    // Return a constant for each query.
    const data = options.targets.map((target) => {
      return new MutableDataFrame({
        refId: target.refId,
        fields: [
          { name: 'Time', values: [from, to], type: FieldType.time },
          { name: 'Value', values: [target.constant, target.constant], type: FieldType.number },
        ],
      });
    });

    return { data };
  }

  async doRequest(query: MyQuery){
    const connectionString = 'DRIVER={AspenTech SQLplus};HOST=BNDSAWN00022;PORT=10014';
    const queryString = "select TS,VALUE from HISTORY where NAME='C6-ME01-1-TE012' and PERIOD = 60*10 and REQUEST = 2 and ts BETWEEN TIMESTAMP '2022-05-17 01:00:00' AND '2022-05-18 14:00:00'";
    const connection1 = await odbc.connect(connectionString);
    const response = await connection1.query(queryString)
    return response;

    // const pool = await odbc.pool();
    // const result = await pool.query(");
    // return result; 

  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
