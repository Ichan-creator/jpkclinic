const showNavbar = (toggleId, navId, bodyId, headerId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId);

  if (toggle && nav && bodypd && headerpd) {
    nav.addEventListener("mouseenter", () => {
      if (window.innerWidth > 768) {
        nav.classList.add("show");
        toggle.classList.add("bx-x");
        bodypd.classList.add("body-pd");
        headerpd.classList.add("body-pd");
      }
    });

    nav.addEventListener("mouseleave", () => {
      if (window.innerWidth > 768) {
        nav.classList.remove("show");
        toggle.classList.remove("bx-x");
        bodypd.classList.remove("body-pd");
        headerpd.classList.remove("body-pd");
      }
    });

    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");
      toggle.classList.toggle("bx-x");
      bodypd.classList.toggle("body-pd");
      headerpd.classList.toggle("body-pd");
    });
  }
};

showNavbar("header-toggle", "nav-bar", "body-pd", "header");

const linkColor = document.querySelectorAll(".nav__link");

function colorLink() {
  if (linkColor) {
    linkColor.forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
  }
}
linkColor.forEach((l) => l.addEventListener("click", colorLink));

const { h } = window.gridjs;

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: [
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
            item.treatmentDateDone
              ? dayjs(item.treatmentDateDone).format("MMMM DD, YYYY hh:mm A")
              : "",
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
