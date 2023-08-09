document.addEventListener('DOMContentLoaded', () => {
    const billTableBody = document.querySelector('#billTable tbody');
    var jsonData = {}
    function get_extracted_data(){
      var url = "https://mnyea93s8f.execute-api.ap-south-1.amazonaws.com/Production-Qeury";
      console.log("url",url);
      fetch(url)
        .then(response => response.json())
        .then(data => {
            jsonData = data.files;
            console.log(jsonData);
     console.log(typeof(jsonData));
      jsonData.forEach((bill) => {
            const row = document.createElement('tr');

            const keys = ['FileName', 'PushInTime', 'CompanyId', 'EmployeeName', 'ReferenceId','Qreference', 'CompeleTime', 'Eamount', ,"HospitalName","Patientn", 'Flink'];
            keys.forEach((key) => {
              const cell = document.createElement('td');

              if (key === 'Flink') {
                const linkIcon = document.createElement('span');
                linkIcon.innerHTML = '➦'; // Emoji for the link
                const link = document.createElement('a');
                const queries = new URLSearchParams(bill)
                link.href = "/Qubes_Health/dashboard.html?" + queries;
                link.target = '_blank';
                link.appendChild(linkIcon);
        
                cell.appendChild(link);
              }
              else if(key == 'PushInTime'){
                cell.textContent = bill[key].replace("GMT", "").slice(0, -4);
              }
              else if (isNaN(bill[key])) {
                cell.textContent = bill[key];
              } else {
                cell.textContent = 'Pending';
              }
        
              row.appendChild(cell);
            });
        
            billTableBody.appendChild(row);
          })
        })
        .catch(error => console.error(error));
     }
     get_extracted_data();

});
function openPDF() {
  // Replace 'YOUR_PRESIGNED_URL' with the actual presigned URL
  const presignedUrl = 'https://qubesbillsystem.s3.amazonaws.com/bill_1.pdf?response-content-type=application%2Fpdf&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARWQZ4LWKKXND7W75%2F20230730%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20230730T203749Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=0ba94a79cd682cd6b2c32138f5e2292ff0a54c7b2adc0478697926605fb367ea';

  // Open the PDF in a new window or tab
  window.open(presignedUrl, '_blank');
}
