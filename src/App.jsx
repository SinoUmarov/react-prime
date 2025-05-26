import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function App() {
  const [products, setProducts] = useState([
    { id: 1, name: "abu", country: "dushanbe", complete: true, phone: 1223435 },
    {
      id: 2,
      name: "hisor",
      country: "dushanbe",
      complete: false,
      phone: 1223435,
    },
    {
      id: 3,
      name: "abubakr",
      country: "khujand",
      complete: true,
      phone: 1223435,
    },
  ]);

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [infoDialogVisible, setInfoDialogVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [infoUser, setInfoUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [nextId, setNextId] = useState(4);

  const countryOptions = [
    { label: "all", value: null },
    ...[...new Set(products.map((p) => p.country))].map((country) => ({
      label: country,
      value: country,
    })),
  ];

  const filteredProducts = products.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || p.country === selectedCountry;
    return matchesName && matchesCountry;
  });

  const completeBody = (rowData) => (
    <i
      className={`pi ${
        rowData.complete
          ? "pi-check-circle text-green-500"
          : "pi-times-circle text-red-500"
      }`}
    ></i>
  );

  const actionBody = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-warning"
        onClick={() => handleEdit(rowData)}
      />
      <Button
        icon="pi pi-info-circle"
        className="p-button-rounded p-button-info"
        onClick={() => handleInfo(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => handleDelete(rowData.id)}
      />
      <Button
        icon="pi pi-check"
        className="p-button-rounded p-button-success"
        onClick={() => toggleComplete(rowData.id)}
      />
    </div>
  );

  const handleEdit = (rowData) => {
    setCurrentUser({ ...rowData });
    setEditDialogVisible(true);
  };

  const handleAdd = () => {
    const newUser = {
      id: nextId,
      name: "",
      country: "",
      phone: "",
      complete: false,
    };
    setCurrentUser(newUser);
    setEditDialogVisible(true);
  };

  const handleInfo = (rowData) => {
    setInfoUser(rowData);
    setInfoDialogVisible(true);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const toggleComplete = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, complete: !p.complete } : p))
    );
  };

  const saveChanges = () => {
    if (products.some((p) => p.id === currentUser.id)) {
      setProducts((prev) =>
        prev.map((p) => (p.id === currentUser.id ? currentUser : p))
      );
    } else {
      setProducts((prev) => [...prev, currentUser]);
      setNextId(nextId + 1);
    }
    setEditDialogVisible(false);
  };

  return (
    <div className="card" style={{ padding: "2rem" }}>
      <div className="flex gap-2 mb-3">
        <InputText
          placeholder="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Dropdown
          value={selectedCountry}
          options={countryOptions}
          onChange={(e) => setSelectedCountry(e.value)}
          placeholder="country"
        />
        <Button label="add" icon="pi pi-plus" onClick={handleAdd} />
      </div>

      <DataTable
        value={filteredProducts}
        paginator
        rows={5}
        stripedRows
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="id" header="ID" />
        <Column field="name" header="Name" />
        <Column field="country" header="Country" />
        <Column field="phone" header="Phone" />
        <Column header="Complete" body={completeBody} />
        <Column header="Action" body={actionBody} />
      </DataTable>

      <Dialog
        header={currentUser?.id >= nextId ? "add" : "edit"}
        visible={editDialogVisible}
        style={{ width: "30vw" }}
        onHide={() => setEditDialogVisible(false)}
      >
        {currentUser && (
          <div className="flex flex-column gap-3">
            <div>
              <label>name</label>
              <InputText
                value={currentUser.name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, name: e.target.value })
                }
                className="w-full"
              />
            </div>
            <div>
              <label>country</label>
              <InputText
                value={currentUser.country}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, country: e.target.value })
                }
                className="w-full"
              />
            </div>
            <div>
              <label>phone</label>
              <InputText
                value={currentUser.phone}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, phone: e.target.value })
                }
                className="w-full"
              />
            </div>
            <Button label="save" icon="pi pi-check" onClick={saveChanges} />
          </div>
        )}
      </Dialog>

      {/* Диалог информации */}
      <Dialog
        header="info"
        visible={infoDialogVisible}
        style={{ width: "30vw" }}
        onHide={() => setInfoDialogVisible(false)}
      >
        {infoUser && (
          <div className="flex flex-column gap-3 p-2">
            <div>
              <strong>name:</strong> {infoUser.name}
            </div>
            <div>
              <strong>country:</strong> {infoUser.country}
            </div>
            <div>
              <strong>phone:</strong> {infoUser.phone}
            </div>
            <div>
              <strong>status</strong>{" "}
              {infoUser.complete ? " complete" : " completed"}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
