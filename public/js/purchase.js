    function filterVehicles() {
    const classSelect = document.getElementById("classification_id");
    const selectedClass = classSelect.value;
    const vehicleSelect = document.getElementById("inventory_id");

        for (let i = 0; i < vehicleSelect.options.length; i++) {
        const opt = vehicleSelect.options[i];
        if (!opt.value) continue; 
        opt.style.display = (opt.getAttribute("data-class") === selectedClass) ? "block" : "none";
        }

    vehicleSelect.selectedIndex = 0; 
    document.getElementById("sale_price").value = "";
  }

    function updatePrice() {
        const vehicleSelect = document.getElementById("inventory_id");
        const selectedOption = vehicleSelect.options[vehicleSelect.selectedIndex];
        const price = selectedOption.getAttribute("data-price");
        document.getElementById("sale_price").value = price || "";
  }

