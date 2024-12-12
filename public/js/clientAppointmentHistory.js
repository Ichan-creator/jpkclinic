const { h } = window.gridjs;

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: [
      { name: "Pet ID", hidden: true },
      "Pet Name",
      "Animal Type",
      "Breed",
      "Treatment Date",
      "Service",
      "Weight (kg)",
      "Against",
      "Manufacturer",
      "Serial/Lot No.",
      "Expired Date",
      "Treatment Date Done",
      "Veterinarian",
      {
        id: "action",
        name: "",
        formatter: (cell, row) => {
          return h(
            "button",
            {
              className: "view-result-button",
              onClick: () => {
                window.location.href = `/owned-pets/${row.cells[0].data}`;
              },
            },
            "View Medical Records"
          );
        },
      },
    ],
    width: "100%",
    fixedHeader: true,
    pagination: {
      limit: 5,
      summary: true,
      resetPageOnUpdate: true,
    },
    search: true,
    language: {
      search: {
        placeholder: "🔍 Search...",
      },
    },
    server: {
      url: `/appointments-history-list`,
      method: "GET",
      then: (data) =>
        data.map((item) => {
          console.log(item);
          return [
            item.pets[0].id,
            item.pets[0].name,
            item.pets[0].animalType,
            item.pets[0].breed,
            dayjs(item.appointmentDate).format("MMMM DD, YYYY hh:mm A"),
            item.service,
            item.petWeight,
            item.against,
            item.manufacturer,
            item.serialLotNumber,
            item.expiredDate,
            dayjs(item.treatmentDateDone).format("MMMM DD, YYYY hh:mm A"),
            item.veterinarian,
          ];
        }),
      handle: (res) => {
        if (res.status === 404) return { data: [] };
        if (res.ok) return res.json();

        throw Error("oh no :(");
      },
    },
  }).render(document.getElementById("clientAppointmentHistoryTable"));
});
