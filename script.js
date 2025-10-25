// script.js - simple lookup against local data.json
let data = [];
const resultsBody = document.getElementById('resultsBody');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

async function loadData(){
  try{
    const resp = await fetch('data.json');
    data = await resp.json();
  }catch(e){
    resultsBody.innerHTML = '<p class="muted">Failed to load data.json. Make sure the file exists next to index.html.</p>';
  }
}

function normalize(s){
  if(!s) return '';
  return s.toString().trim().toUpperCase().replace(/[^A-Z0-9-]/g,'');
}

function renderResults(rows){
  if(!rows || rows.length===0){
    resultsBody.innerHTML = '<p class="muted">No records found for your search.</p>';
    return;
  }
  // build table
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Challan No</th><th>Vehicle No</th><th>DL No</th><th>Offense</th><th>Date</th><th>Fine (₹)</th><th>Status</th></tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  for(const r of rows){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.challan_no}</td>
      <td>${r.vehicle_no}</td>
      <td>${r.dl_no || '-'}</td>
      <td>${r.offense}</td>
      <td>${r.date}</td>
      <td>${r.fine}</td>
      <td>${r.status === 'PAID' ? '<span class="status-paid">Paid</span>' : '<span class="status-pending">Pending</span>'}</td>
    `;
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  resultsBody.innerHTML = '';
  resultsBody.appendChild(table);
}

function performSearch(){
  const q = normalize(searchInput.value);
  if(!q){
    resultsBody.innerHTML = '<p class="muted">Please enter a search value.</p>';
    return;
  }
  const type = document.querySelector('input[name="searchType"]:checked').value;
  let rows = [];
  if(type === 'vehicle'){
    rows = data.filter(x => normalize(x.vehicle_no) === q);
  }else if(type === 'dl'){
    rows = data.filter(x => normalize(x.dl_no) === q);
  }else if(type === 'challan'){
    rows = data.filter(x => normalize(x.challan_no) === q);
  }
  renderResults(rows);
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keyup', function(e){ if(e.key === 'Enter') performSearch(); });

// initial load
loadData();
