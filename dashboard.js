const params = new URLSearchParams(window.location.search);
const data = {};
const keys = ['FileName', 'PushInTime', 'CompanyId', 'EmployeeName', 'ReferenceId', 'CompeleTime', 'Eamount','Ramount', 'Flink', 'HospitalName', "Patientn", "Qreference"];
keys.forEach(k => {
  data[k] = params.get(k);
})
console.log(data)

async function getCurrentIST() {
  // Get the current UTC time
  const currentUtcTime = new Date();

  // Calculate the time difference for IST (UTC+5:30)
  const istTimeDifference = 5 * 60 + 30; // in minutes

  // Convert UTC time to IST
  const istTime = new Date(currentUtcTime.getTime() + istTimeDifference * 60 * 1000);

  // Format IST time as a string (YYYY-MM-DD HH:MM AM/PM)
  const istTimeString = istTime.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: true
  });

  return istTimeString;
}

async function updateDatabase(referenceId) {
  const apiUrl = "https://xspw9bzvhb.execute-api.ap-south-1.amazonaws.com/demo_prod"; // Replace with your actual API URL
  
  const completeTime = await getCurrentIST();
  
  const data = {
    reference_id: referenceId,
    comptim: completeTime
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  
  try {
    const response = await fetch(apiUrl, options);
    const result = await response.json();
    
    if (result) {
      console.log("Data updated successfully.");
      return true;
    } else {
      console.log("Data update failed.");
      return false;
    }
  } catch (error) {
    console.error("Error updating data:", error);
    return false;
  }
}
//Changing The Total Amount Value
var dynamicValueElement = document.getElementById("dynamic-value");
var dynamicValue = "₹ " + data['Eamount'];
dynamicValueElement.innerHTML = dynamicValue;


//Adding Hospital Name
var Name_Hospital = document.getElementById("Name_Hospital");
if (data["HospitalName"] == null) var Hosp = "Not Found"
else var Hosp = data["HospitalName"]
Name_Hospital.textContent = Hosp


//Adding Patient Name
var Name_patient = document.getElementById("Name_Patient");
if (data["Patientn"].length > 0) var pat = data["Patientn"]
else var pat = "Not Found"
Name_patient.textContent = pat


//Adding IPD Number
var ipd_nam = document.getElementById("ipd_n");
var ipd = data["CompanyId"]
ipd_nam.textContent = ipd

//Adding UHD Number
var uhd_n = document.getElementById("uhid_n");
var uhd = data["EmployeeName"]
uhd_n.textContent = uhd

//Adding Date of Admission
var doa = document.getElementById("doa_n");
var doa_f = data["PushInTime"]

doa.textContent = doa_f

//Adding Date of Admission
var dod = document.getElementById("dod_n");
if (!isNaN(data["CompleteTime"])) var dod_f = data["CompeleTime"].replace("GMT", "")
else var dod_f = "Pending/In Progress"
dod.textContent = dod_f

//Adding Requested Amount
document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById('Requested_Amount');
  button.value = "₹ " + data['Ramount'];
});


//Billing Date
var bda = document.getElementById("bill_d");
var bdaf = data["ReferenceId"]
bda.textContent = bdaf

// function fetchPdfUrl() {
//   // Replace this with your actual backend request logic
//   // For simplicity, we are using a static URL
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       var myHeaders = new Headers();
//       myHeaders.append("Content-Type", "text/plain");

//       var raw = "{\n  \"bucket_name\": \"qubesbillsystem\",\n  \"object_key\": \"bill_1.pdf\"\n}";

//       var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: raw,
//         redirect: 'follow'
//       };

//       // Declare the demo variable
//       var demo;

//       fetch("https://6ir57e51ql.execute-api.ap-south-1.amazonaws.com/production", requestOptions)
//         .then(response => response.text())
//         .then(result => {
//           // Assign the result to the demo variable
//           demo = result;
//           console.log(demo); // Display the link in the console
//         })
//         .catch(error => console.log('error', error));
//         console.log("Demo" + demo);
//       resolve(demo);
//     }, 1000); // Simulating a delay of 1 second to fetch the URL
//   });
// }
// function fetchPdfUrl() {
//   // Replace this with your actual backend request logic
//   // For simplicity, we are using a static URL
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       var myHeaders = new Headers();
//       myHeaders.append("Content-Type", "text/plain");

//       var raw = "{\n  \"bucket_name\": \"qubesbillsystem\",\n  \"object_key\": \"bill_1.pdf\"\n}";

//       var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: raw,
//         redirect: 'follow'
//       };

//       fetch("https://6ir57e51ql.execute-api.ap-south-1.amazonaws.com/production", requestOptions)
//         .then(response => response.json())
//         .then(result => {
//           // Resolve the Promise with the result
//           resolve(result);
//         })
//         .catch(error => {
//           // Reject the Promise if there's an error
//           reject(error);
//         });
//     }, 1000); // Simulating a delay of 1 second to fetch the URL
//   });
// }

function fetchPdfUrl1(bucket_name, object_key) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "text/plain");

      // Construct the raw JSON data using template literals
      var raw = `{
        "bucket_name": "${bucket_name}",
        "object_key": "${object_key}"
      }`;

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("https://6ir57e51ql.execute-api.ap-south-1.amazonaws.com/production", requestOptions)
        .then(response => response.json())
        .then(result => {
          // Resolve the Promise with the result
          resolve(result);
        })
        .catch(error => {
          // Reject the Promise if there's an error
          reject(error);
        });
    }, 1000); // Simulating a delay of 1 second to fetch the URL
  });
}



// Function to update the href attribute of the anchor link
async function updatePdfLink() {
  const pdfLinkElement = document.getElementById('pdfLink');
  const pdfUrl = await fetchPdfUrl1("qubesbillsystem","Nuvama - GMC 2023-24.pdf");
  console.log("Me " + pdfUrl);
  pdfLinkElement.href = pdfUrl;
}

async function updatePdfLink1() {
  const pdfLinkElement = document.getElementById('pdfLinkpol');
  const pdfUrl = await fetchPdfUrl1("qubesbillsystem",data["FileName"]);
  console.log("Me " + pdfUrl);
  pdfLinkElement.href = pdfUrl;
}
// Call the updatePdfLink function to update the link on page load
updatePdfLink();
updatePdfLink1()

// JSON data
url = "https://claimsftr.com/api_alyve/extract_generic_bill"

async function fetchFromApi() {
  
  console.log("adsf", data)
  const formData = new FormData()
  keys.forEach(k => {
    formData.append(k, data[k])
  })
  formData.append("RefernceId", "asdfl" + Math.random() * 100)
  formData.append("CompleteTime", data["CompeleTime"])
  formData.append("s3_url", data["Flink"])
  const res = await fetch(url, {
    method: "POST",
    body: formData,
  })
  const d = await res.json();
  console.log(d);
  return d.data.result;
  
}
var jsonData;
(async () => {
  jsonData = await fetchFromApi()
  console.log(jsonData)
  jsonData = jsonData.map(o => {
    return {
      ...o,
      Description: o.Description,
      approved: null,
      requestedAmount: o.Amount,
      approvedAmount: "",
    }
  })

  // Generate table dynamically
  var tableContainer = document.getElementById('table-container');
  var table = document.createElement('table');
  tableContainer.appendChild(table);

  // Create table headers
  var thead = document.createElement('thead');
  table.appendChild(thead);
  var headerRow = document.createElement('tr');
  thead.appendChild(headerRow);

  // Column 1: Name
  var nameHeader = document.createElement('th');
  nameHeader.textContent = 'Description';
  headerRow.appendChild(nameHeader);

  // Column 2: Approval CheckBox
  var requestedAmountHeader = document.createElement('th');
  requestedAmountHeader.textContent = 'Approval CheckBox';
  headerRow.appendChild(requestedAmountHeader);

  // Column 3: Requested Amount
  var requestedAmountHeader = document.createElement('th');
  requestedAmountHeader.textContent = 'Requested Amount';
  headerRow.appendChild(requestedAmountHeader);

  // Column 4: Approved Amount
  var approvedAmountHeader = document.createElement('th');
  approvedAmountHeader.textContent = 'Approved Amount';
  headerRow.appendChild(approvedAmountHeader);

  // Create table rows
  var tbody = document.createElement('tbody');
  table.appendChild(tbody);
  jsonData.forEach(function (obj, index) {
    var row = document.createElement('tr');

    // Column 1: Description
    var descriptionCell = document.createElement('td');
    var descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    if (obj.Description == "") {
      descriptionCell.appendChild(descriptionInput);
    } else {
      descriptionCell.disabled = true;
      descriptionCell.textContent = obj.Description;
    }
    descriptionInput.addEventListener("input", (e) => {
      // Object.assign(jsonData[index], {
      //   ...obj,
      //   Description: e.target.value,
      // })
      obj.Description = e.target.value
      console.log(jsonData[index])
    })
    row.appendChild(descriptionCell);

    // Column 2: Approval (with two checkboxes)
    var approvalCell = document.createElement('td');
  var checkbox1 = document.createElement('input');
  checkbox1.type = 'checkbox';
  checkbox1.name = 'approval';
  checkbox1.classList.add("approve-checkbox")
    checkbox1.addEventListener("change", (e) => {
      console.log(e.target.value)
      // Object.assign(jsonData[index], {
      //   ...obj,
      //   approved: true,
      // })
      obj.approved = true
      console.log(jsonData[index])
    })
    var checkbox2 = document.createElement('input');
    checkbox2.type = 'checkbox';
    checkbox2.name = 'rejection';
    checkbox2.classList.add("reject-checkbox")
    checkbox2.addEventListener("change", (e) => {
      // Object.assign(jsonData[index], {
      //   ...obj,
      //   approved: false,
      // })
      obj.approved = false
      console.log(jsonData[index])
    })
    approvalCell.appendChild(checkbox1);
    approvalCell.appendChild(checkbox2);
    row.appendChild(approvalCell);

    function containsOnlyNumbers(inputString) {
      const regex = /^[0-9]+$/;
      return regex.test(inputString);
    }

    // Column 3: Requested Amount
    var requestedAmountCell = document.createElement('td');
    var requestedAmountInput = document.createElement('input');
    requestedAmountInput.classList.add('request-total-fi');
    requestedAmountInput.type = 'text';
    if (containsOnlyNumbers(obj.requestedAmount)) {
      requestedAmountInput.value = parseFloat(obj.requestedAmount);
      requestedAmountInput.disabled = false; // Allow editing
    } else {
      requestedAmountInput.value = parseFloat(obj.requestedAmount);
      requestedAmountInput.disabled = true; // Disable editing
    }
    requestedAmountCell.appendChild(requestedAmountInput);
    row.appendChild(requestedAmountCell);

    // Column 4: Approved Amount
    var approvedAmountCell = document.createElement('td');
    var approvedAmountInput = document.createElement('input');
    approvedAmountInput.type = "number"
    approvedAmountInput.addEventListener("input", (e) => {
      console.log(obj)
      if (obj.approved == null) {
        approvedAmountInput.value = ''
        alert("Please Choose Status of Line Item First")
      }
      else {
        if (obj.approved) {
          if (parseFloat(e.target.value) == 0) {
            console.log(e.target.value);
            obj.approvedAmount = ''
            approvedAmountInput.value = ''
            alert("Approved Amount Can Not Be Zero")
            return
          }
          if (!parseFloat(e.target.value)) {
            obj.approvedAmount = ''
            approvedAmountInput.value = ''
            alert("please enter a valid value")
            return
          }
        }
        else {
          if (e.target.value == '') {
            console.log(e.target.value);
            obj.approvedAmount = ''
            approvedAmountInput.value = ''
            alert("Please Put A Valid Reason. Reason Can't Be Empty")
            return
          }
          if (parseFloat(e.target.value)) {
            obj.approvedAmount = ''
            approvedAmountInput.value = ''
            alert("Integer Values Not Allowed For Reason. Pleasae Approve First")
            return
          }
        }
        obj.approvedAmount = parseFloat(e.target.value).toFixed(2)
        console.log(jsonData[index])
      }

    })
    approvedAmountInput.classList.add('approved-total-fi');
    approvedAmountInput.type = 'text';
    approvedAmountInput.value = 0;
    approvedAmountCell.appendChild(approvedAmountInput);
    row.appendChild(approvedAmountCell);

    tbody.appendChild(row);

    // Allow only one checkbox to be active at a time
    var checkboxes = row.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        if (this.checked) {
          checkboxes.forEach(function (otherCheckbox) {
            if (otherCheckbox !== checkbox) {
              otherCheckbox.checked = false;
            }
          });
        }
      });
    });
  });


  function updateTotals() {
    var totalRequestedAmount = 0;
    var totalApprovedAmount = 0;
    var inputElements = document.querySelectorAll('#table-container input[type="text"].request-total-fi');
    inputElements.forEach(function (input) {
      var value = parseFloat(input.value);
      if (!isNaN(value)) {
        totalRequestedAmount += value;
      }
    });

    var dataelement = document.querySelectorAll('#table-container input[type="text"].approved-total-fi');
    dataelement.forEach(function (input) {
      var value = parseFloat(input.value);
      console.log(value);
      if (!isNaN(value)) {
        totalApprovedAmount += value;
      }
    });


    // jsonData.forEach(function (data) {
    //     var amount = parseFloat(data.Amount);
    //     console.log(amount);
    //     if (!isNaN(amount)) {
    //         totalApprovedAmount += amount;
    //     }
    // });

    var totalsTable = document.getElementById('my-table-total');
    var approvedTotalCell = totalsTable.querySelector('.approved-total input');
    var requestedTotalCell = totalsTable.querySelector('.requested-total input');
    const aamt = document.getElementById("Approved_Amount");
    aamt.value = totalApprovedAmount.toFixed(2);
    approvedTotalCell.value = totalApprovedAmount.toFixed(2);
    requestedTotalCell.value = totalRequestedAmount.toFixed(2);
  }
  // Add event listeners to input elements
  var inputElements = document.querySelectorAll('#table-container input[type="text"]');
  inputElements.forEach(function (input) {
    input.addEventListener('input', updateTotals);
  });

  // Create totals row in separate table
  var totalsTable = document.getElementById('my-table-total');
  var totalsRow = document.createElement('tr');
  totalsTable.appendChild(totalsRow);

  var totalsLabelCell = document.createElement('td');
  totalsLabelCell.textContent = 'Grand Total';
  totalsLabelCell.classList.add('temp');
  totalsRow.appendChild(totalsLabelCell);

  var requestedTotalCell = document.createElement('td');
  requestedTotalCell.classList.add('requested-total');
  requestedTotalCell.innerHTML = '<input type="text" value="0" disabled>';
  totalsRow.appendChild(requestedTotalCell);

  var approvedTotalCell = document.createElement('td');
  approvedTotalCell.classList.add('approved-total');
  const approvedTotalCellInput = document.createElement("input")
  approvedTotalCellInput.value = '0'
  approvedTotalCellInput.type = "text"
  approvedTotalCell.appendChild(approvedTotalCellInput)
  totalsRow.appendChild(approvedTotalCell);

  const backendUrl = 'https://example.com/get_pdf_url'; // Replace with your actual backend URL

  // Function to fetch the URL from the backend


  Policy_Detail = {
    "Insurer": "Zuno General Insurance Limited",
    "Policy No.": "EGIC0110239300000",
    "Policy Period": "15th Apr 2023 to 14th Apr 2024",
    "TPA": "East West Assist TPA Pvt. Ltd",
    "Family Definition": "Employee + 5 Dependants (Spouse + 2 Dependent Children up to 25 years + 2 Dependent Parents/Parents in law cross selection is not permitted)",
    "Sum InsuredFamily Floater": {
      "Executive/Junior Associate": "INR 200,000",
      "Associate/Assistant Manager": "INR 250,000",
      "Manager/Senior Manager/Chief Manager": "INR 350,000",
      "Assistant Vice President/Deputy Vice President": "INR 450,000",
      "Vice President/Associate Director": "INR 550,000",
      "Senior Vice President/Executive Vice President": "INR 650,000",
      "Sr. EVP, President, Group President, Executive Director, MD": "INR 700,000"
    },
    "Pre existing diseases": "Yes. Covered from Day One",
    "Waiting Periods": "Not Applicable",
    "Coverage": "Inpatient hospitalization Active treatment with minimum 24 hours hospitalization with exception of certain Day care expenses",
    "PrePost Hospitalisation Expenses": "Yes. Pre 30 days, Post 60 days",
    "Maternity benefits": "Covered for Rs.75000/ For normal delivery and Rs.100000/ For CSection",
    "Baby covered from Day 1": "Covered up to family sum insured limit, provided the employee declares the new born within 30 days from date of birth",
    "Room rent eligibility": "No proportionate deduction applicable if insured is admitted in room upto double the specified limit. If the Insured Person is admitted in a room where the Room Rent incurred is more than double the limit specified, then the Insured Person shall bear the rateable proportion of the total associated Medical Expenses (including surcharge or taxes thereon) in the proportion of the difference between the room rent actually incurred and double of the room rent limit. (I.e. if applicable room rent limit is Rs.3500/, proportionate deduction will happen as per Rs.7,000/)",
    "CoPayment": {
      "No Copay on Employees Claims": "None",
      "10% Copay on Spouse/Child Claims": "None",
      "20% CoPay on Parental Claims": "None",
      "No Copay in case of cashless claims from PPN hospitals": "None",
      "No Copay on COVID19 claims": "None"
    },
    "Oral Chemo": "Treatment of Cancer in form of oral chemotherapy is covered",
    "Cataract Lens": {
      "Monofocal": "As per policy T&C",
      "Multifocal/Torro/Femto lens": "At additional 10% copayment i.e. Employee, Spouse, Children 20%, Parents 30%"
    },
    "Infertility Treatment": "Infertility related treatment is covered within maternity limit subject to inpatient or hospitalization treatment",
    "Robotics": "Payable up to reasonable and customary limit (laparoscopic surgery for the same ailment). Exceptions for full payment of claims made only for cancers of prostate or brain surgeries.",
    "Stem cell Treatment": "Not covered except Haematopoietic Stem Cell Transplantation for blood and bone marrow cancers like Leukemia, Lymphoma and Multiple Myeloma",
    "Lasic surgery for Eye sight correction beyond +/ 7": "Payable only when deficit of +/ 7.0 dioptre or more in vision",
    "Sleep Apnoea Syndrome": "Covered up to INR 30,000/",
    "Covid19 treatment/quarantine at Home": "Home care treatment for COVID19 positive cases covered as per policy terms on recommendation from the treating doctor for Home Quarantine",
    "Exclusions": (
      "Injury / disease directly or indirectly caused by or arising from or attributable to War, invasion, Act of Foreign enemy, War like operations (whether war be declared or not)",
      "Circumcision unless necessary for treatment of a disease not excluded hereunder or as may be necessitated due to an accident",
      "Vaccination or inoculation change of life or cosmetic or aesthetic treatment of any description, such as correction of eye sight plastic surgery other than as may be necessitated due to an accident or as apart of any illness",
      "Cost of spectacles and contact lenses, hearing aids.",
      "Dental treatment or surgery of any kind unless requiring hospitalisation.",
      "Convalescence, general debility; rundown condition or rest cure, obesity treatment and its complications including morbid obesity, Congenital external / Congenital internal diseases or defects or anomalies, treatment relating to all psychiatric and psychosomatic disorders, thalassemia, Sterility, Venereal disease, intentional self injury and use of intoxication drugs / alcohol.",
      "All expenses arising out of any condition directly or indirectly caused to or associated with Human TCell Lymphotropic Virus Type III (HTLB  III) or lymphadinopathy Associated Virus (LAV) or the Mutants Derivative or Variation Deficiency Syndrome or any syndrome or condition of a similar kind commonly referred to as AIDS.",
      "Charges incurred at Hospital or Nursing Home primarily for diagnosis xray or Laboratory examinations or other diagnostic studies not consistent with or incidental to the diagnosis and treatment of positive existence of presence of any ailment, sickness or injury, for which confinement is required at a Hospital / Nursing Home or at home under domiciliary hospitalisation as defined.",
      "Expenses on vitamins and tonics unless forming part of treatment for injury or diseases as certified by the attending physician",
      "Injury or Disease directly or indirectly caused by or contributed to by nuclear weapon or materials",
      "Naturopathy Treatment, acupressure, acupuncture, magnetic therapies, experimental and unproven treatment / therapies.",
      "External and or durable Medical / Nonmedical equipment of any kind used for diagnosis and or treatment including CPAP, CAPD, Infusion pump etc. Ambulatory devices i.e., walker, crutches, Belts, Collars, Caps, Splints, Slings, Braces, Stockings, etc., of any kind. Diabetic foot wear, Glucometer / Thermometer and similar related items etc., and also any medical equipment, which subsequently used at home etc.",
      "Genetic disorders and Stem Cell Implantation/ surgery",
      "Change of treatment from one system of medicine to another unless recommended by the consultant / hospital under whom the treatment is taken.",
      "Treatment for Age Related Macular Degeneration ( ARMD ), treatment such as Rotational Field Quantum Magnetic Resonance (RFQMR ), Enhanced External Counter Pulsation ( EECP )",
      "All nonmedical expenses including convenience items for personal comfort such as charges for telephone, television, ayah, private nursing / barber or beauty services, diet charges, baby food, cosmetic, tissue paper, diapers, sanitary pads. Toiletry items and similar incidental expenses",
      "Any kind of Service charges, Surcharges, Admission Fees/Registration Charges levied by the hospital",
      "Maternity related exclusions:",
      "Infertility Treatment  upto limit specified & other policy conditions.",
      "Voluntary termination of pregnancy during first 12 weeks (MTP)",
      "Prenatal and postnatal expenses are not covered unless admitted in Hospital / Nursing Home and treatment is taken there.",
      "Coverage is only for first 2 living children"
    )
  }
  var Total_Coverage = document.getElementById("Total_C");
  var tc = Policy_Detail['Insurer']
  Total_Coverage.textContent = tc;
  updateTotals();

  function updateData(reference_id, comptim) {
    // Prepare the raw JSON data
    var raw = JSON.stringify({
      "reference_id": reference_id,
      "comptim": comptim
    });
  
    // Set up the fetch request
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
  
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
  
    // Perform the fetch request
    fetch("https://xspw9bzvhb.execute-api.ap-south-1.amazonaws.com/demo_prod", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  var myHeaders = new Headers();
  myHeaders.append("X-API-KEY", "f6d646a6c2f2df883ea0cccaa4097358ede98284");
  myHeaders.append("Authorization", "Basic cXViZV9oZWFsdGhfYWRtaW46Q0Y4VGQjTFFxSzdwTXpmblFC");
  myHeaders.append("Content-Type", "application/json");

  document.getElementById("approve-btn")?.addEventListener("click", async (e) => {
    e.preventDefault();
    // Get the current date and time
    // updateDatabase(obj.referenceId) Commented For Reference
    //obj.completeTime = getCurrentIST()

    for (const obj of jsonData) {
      if (obj.approved) {
        // Convert the approvedamount to a whole float
        obj.approvedamount = parseFloat(obj.approvedamount);
      }
    }

    

    // Print the formatted date and time
    //updateData(data["ReferenceId"], formattedDateTime);
    jsonData = jsonData.map(o => {
      return {
        ...o,
        description: o.Description,
        approved: null,
        // requestedAmount: o.requestedAmount,
        // pushintime: o.pushInTime,
        // approvedamount: o.approvedAmount,
        completeTime: o.completeTime,
        // eamount: o.eAmount,
        patient: o.Patientn,
      }
    })

    const finalData = {
      status: "APPROVED",
      patientDetails: data,
      estimateDetails: jsonData
    }

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(finalData),
      redirect: 'follow'
    };
    const res = await fetch("https://pre-prod.qubehealth.com/api/iAssist/claimApprovalWebhook", requestOptions)
    const d = await res.text()
    console.log(d)
    alert("Status: 200 Data Pushed To Qubes Server");
  })

  document.getElementById("reject-btn")?.addEventListener("click", (e) => {
    e.preventDefault();

    for (const obj of jsonData) {
      if (obj.approved) {
        // Convert the approvedamount to a whole float
        obj.approvedamount = parseFloat(obj.approvedamount);
      }
    }
    
    console.log(!jsonData.every(o => !o.approved))
    if(!jsonData.every(o => o.approved == false)){
      alert("please reject all line items first.")
      return;
    }
    jsonData = jsonData.map(o => {
      return {
        ...o,
        description: o.Description,
        approved: null,
        requestedamount: o.requestedAmount,
        pushintime: o.pushInTime,
        approvedamount: o.approvedAmount,
        completetime: o.completeTime,
        eamount: o.eAmount,
        patient: o.Patientn,
      }
    })

    const finalData = {
      status: "REJECTED",
      patientDetails: data,
      estimateDetails: jsonData,
    }

    console.log("asfasf", jsonData)
    const text = prompt("reject?")
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: finalData,
      redirect: 'follow'
    };
    
    fetch("https://pre-prod.qubehealth.com/api/iAssist/claimApprovalWebhook", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  })

})()

