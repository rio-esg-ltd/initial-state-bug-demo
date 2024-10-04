import {
  IServerSideDatasource,
  SetFilterValuesFuncParams,
} from "ag-grid-community";
import rowData from "./rowData.json";
import _ from "lodash";

let timesCalled = 0;

const MOCK_DATA_RESPONSE_TIME = 1000;

const MOCK_FILTER_RESPONSE_TIME = 2000;

const FILTER_FIELD = "profile.company";

export const getFilterValues = ({ success }: SetFilterValuesFuncParams) => {
  setTimeout(() => {
    const values = _(rowData)
      .uniqBy(FILTER_FIELD)
      .orderBy([FILTER_FIELD], ["asc"])
      .map(FILTER_FIELD)
      .value();

    success(values);
  }, MOCK_FILTER_RESPONSE_TIME);
};

export const serverSideDatasource: IServerSideDatasource = {
  getRows({ request, success }) {
    console.log("Times getRows called", ++timesCalled);
    console.log("Request", request);

    setTimeout(() => {
      let data = [...rowData];

      const sortingApplied = request.sortModel.find(
        (s) => s.colId === FILTER_FIELD
      );

      const filterApplied = _.get(request.filterModel, FILTER_FIELD);

      if (sortingApplied) {
        data = _.orderBy(data, [FILTER_FIELD], [sortingApplied.sort]);
      }

      if (filterApplied) {
        data = data.filter((v) =>
          filterApplied.values.includes(v.profile.company)
        );
      }

      const pageData = data.slice(request.startRow, request.endRow);

      success({
        rowData: pageData,
        rowCount: data.length,
      });
    }, MOCK_DATA_RESPONSE_TIME);
  },
};
