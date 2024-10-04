import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.min.css";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { useMemo } from "react";
import { LicenseManager } from "ag-grid-enterprise";
import _ from "lodash";
import { serverSideDatasource, getFilterValues } from "./mockServer";

LicenseManager.setLicenseKey(import.meta.env.VITE_AG_GRID_LICENSE_KEY!);

const columnDefs: ColDef[] = [
  {
    headerName: "Name",
    field: "profile.name",
    filter: false,
  },
  {
    headerName: "Company",
    field: "profile.company",
    filter: "agSetColumnFilter",
    sort: "asc",
    filterParams: {
      values: getFilterValues,
    },
  },
];

export function App() {
  const initialState = useMemo(() => {
    const record = localStorage.getItem("STATE");
    if (record) {
      return JSON.parse(record);
    }
  }, []);

  return (
    <div className="ag-theme-material" style={{ height: "100vh" }}>
      <AgGridReact
        initialState={initialState}
        rowModelType="serverSide"
        pagination={true}
        paginationPageSize={25}
        columnDefs={columnDefs}
        getRowId={({ data }) => data.id}
        serverSideDatasource={serverSideDatasource}
        onStateUpdated={({ state }) => {
          localStorage.setItem("STATE", JSON.stringify(state));
        }}
      />
    </div>
  );
}
