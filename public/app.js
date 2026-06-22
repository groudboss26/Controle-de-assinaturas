const form = document.querySelector('#subscriptionForm');
const formTitle = document.querySelector('#formTitle');
const subscriptionId = document.querySelector('#subscriptionId');
const nameInput = document.querySelector('#name');
const priceInput = document.querySelector('#price');
const dueDateInput = document.querySelector('#due_date');
const periodInput = document.querySelector('#period');
const sharedInput = document.querySelector('#shared');
const myShareInput = document.querySelector('#my_share');
const shareGroup = document.querySelector('#shareGroup');
const alertArea = document.querySelector('#alertArea');
const tableBody = document.querySelector('#subscriptionsTable');
const cancelEditButton = document.querySelector('#cancelEditButton');
const reloadButton = document.querySelector('#reloadButton');
const chartToggleButton = document.querySelector('#chartToggleButton');
const chartPanel = document.querySelector('#chartPanel');
const costChart = document.querySelector('#costChart');
const chartShell = document.querySelector('.chart-shell');
const chartTooltip = document.createElement('div');

let currentSubscriptions = [];
let chartHitAreas = [];

chartTooltip.className = 'chart-tooltip';
chartShell.append(chartTooltip);

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const periodLabels = {
  weekly: 'Semanal',
  monthly: 'Mensal',
  yearly: 'Anual'
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function parseLocalDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function todayAtMidnight() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function daysUntil(dueDate) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil((parseLocalDate(dueDate) - todayAtMidnight()) / millisecondsPerDay);
}

function getStatus(subscription) {
  const remainingDays = daysUntil(subscription.due_date);

  if (remainingDays < 0) {
    return {
      label: 'Vencido',
      className: 'status-expired',
      rowClass: 'is-expired',
      message: `${subscription.name} venceu em ${subscription.due_date}.`
    };
  }

  if (remainingDays <= 7) {
    return {
      label: 'Proximo',
      className: 'status-soon',
      rowClass: 'is-soon',
      message: `${subscription.name} vence em ${remainingDays === 0 ? 'hoje' : `${remainingDays} dia(s)`}.`
    };
  }

  return {
    label: 'Em dia',
    className: 'status-ok',
    rowClass: '',
    message: ''
  };
}

function getNextDueDate(dueDate, period) {
  const date = parseLocalDate(dueDate);

  if (period === 'weekly') {
    date.setDate(date.getDate() + 7);
  }

  if (period === 'monthly') {
    date.setMonth(date.getMonth() + 1);
  }

  if (period === 'yearly') {
    date.setFullYear(date.getFullYear() + 1);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getMonthlyEquivalent(subscription) {
  if (subscription.period === 'weekly') {
    return subscription.my_share * 4.345;
  }

  if (subscription.period === 'yearly') {
    return subscription.my_share / 12;
  }

  return subscription.my_share;
}

function showAlert(message, type = 'success') {
  alertArea.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" aria-label="Fechar"></button>
    </div>
  `;

  alertArea.querySelector('.btn-close').addEventListener('click', () => {
    alertArea.innerHTML = '';
  });
}

function updateShareState() {
  const isShared = sharedInput.checked;
  myShareInput.disabled = !isShared;
  myShareInput.required = isShared;
  shareGroup.classList.toggle('opacity-50', !isShared);

  if (!isShared) {
    myShareInput.value = priceInput.value;
  }
}

function buildPayload() {
  return {
    name: nameInput.value.trim(),
    price: Number(priceInput.value),
    due_date: dueDateInput.value,
    period: periodInput.value,
    shared: sharedInput.checked,
    my_share: sharedInput.checked ? Number(myShareInput.value) : Number(priceInput.value)
  };
}

function resetForm() {
  form.reset();
  subscriptionId.value = '';
  formTitle.textContent = 'Nova assinatura';
  document.body.classList.remove('is-editing');
  updateShareState();
}

async function requestJson(url, options) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Falha ao processar a solicitacao.');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function loadSummary() {
  const summary = await requestJson('/subscriptions/summary');
  document.querySelector('#countValue').textContent = summary.count;
  document.querySelector('#sharedValue').textContent = summary.sharedCount;
  document.querySelector('#monthlyValue').textContent = currencyFormatter.format(summary.monthlyTotal);
  document.querySelector('#annualValue').textContent = currencyFormatter.format(summary.annualTotal);
  document.querySelector('#nextDueValue').textContent = summary.nextDue
    ? `Proximo: ${summary.nextDue.name} em ${summary.nextDue.due_date}`
    : 'Sem vencimentos';
}

function showDueAlerts(subscriptions) {
  const expired = subscriptions.filter((subscription) => daysUntil(subscription.due_date) < 0);
  const dueSoon = subscriptions.filter((subscription) => {
    const remainingDays = daysUntil(subscription.due_date);
    return remainingDays >= 0 && remainingDays <= 7;
  });

  if (expired.length > 0) {
    showAlert(`${expired.length} assinatura(s) vencida(s): ${expired.map((item) => escapeHtml(item.name)).join(', ')}.`, 'danger');
    return;
  }

  if (dueSoon.length > 0) {
    showAlert(`${dueSoon.length} assinatura(s) proxima(s) do vencimento: ${dueSoon.map((item) => escapeHtml(item.name)).join(', ')}.`, 'warning');
  }
}

function renderRows(subscriptions) {
  if (subscriptions.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-secondary py-4">Nenhuma assinatura cadastrada.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = subscriptions.map((subscription) => {
    const status = getStatus(subscription);
    const safeName = escapeHtml(subscription.name);

    return `
    <tr class="${status.rowClass}">
      <td>
        <strong>${safeName}</strong>
        ${subscription.shared ? '<span class="badge text-bg-success ms-2">Compartilhada</span>' : ''}
      </td>
      <td><span class="status-pill ${status.className}">${status.label}</span></td>
      <td>${currencyFormatter.format(subscription.price)}</td>
      <td>${currencyFormatter.format(subscription.my_share)}</td>
      <td>${subscription.due_date}</td>
      <td>${periodLabels[subscription.period]}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-sm btn-outline-success" data-action="renew" data-id="${subscription.id}" type="button">Renovar</button>
          <button class="btn btn-sm btn-outline-warning" data-action="edit" data-id="${subscription.id}" type="button">Editar</button>
          <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${subscription.id}" type="button">Cancelar</button>
        </div>
      </td>
    </tr>
  `;
  }).join('');
}

function drawChart(subscriptions) {
  if (chartPanel.hidden) {
    return;
  }

  chartHitAreas = [];

  const context = costChart.getContext('2d');
  const width = Math.max(620, subscriptions.length * 140 + 120);
  const height = 260;
  const ratio = window.devicePixelRatio || 1;

  costChart.style.width = `${width}px`;
  costChart.width = width * ratio;
  costChart.height = height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);

  context.fillStyle = '#050505';
  context.fillRect(0, 0, width, height);
  context.font = '13px Arial';

  if (subscriptions.length === 0) {
    context.fillStyle = '#b8b8b8';
    context.fillText('Sem dados para exibir.', 24, 40);
    return;
  }

  const bars = subscriptions.map((subscription, index) => {
    const monthly = getMonthlyEquivalent(subscription);
    return {
      x: 70 + index * ((width - 120) / Math.max(subscriptions.length - 1, 1)),
      label: subscription.name,
      monthly,
      annual: monthly * 12
    };
  });

  const maxValue = Math.max(...bars.flatMap((bar) => [bar.monthly, bar.annual]));
  const chartTop = 24;
  const chartBottom = 198;
  const chartHeight = chartBottom - chartTop;
  const yFor = (value) => chartBottom - (value / maxValue) * chartHeight;

  context.strokeStyle = '#343434';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(54, chartTop);
  context.lineTo(54, chartBottom);
  context.lineTo(width - 32, chartBottom);
  context.stroke();

  function drawBarGroup(bar) {
    const barWidth = 24;
    const gap = 8;
    const monthlyY = yFor(bar.monthly);
    const annualY = yFor(bar.annual);
    const monthlyX = bar.x - barWidth - gap / 2;
    const annualX = bar.x + gap / 2;

    context.fillStyle = '#22c55e';
    context.fillRect(monthlyX, monthlyY, barWidth, chartBottom - monthlyY);

    context.fillStyle = '#ffc107';
    context.fillRect(annualX, annualY, barWidth, chartBottom - annualY);

    chartHitAreas.push({
      x: monthlyX,
      y: monthlyY,
      width: barWidth,
      height: chartBottom - monthlyY,
      label: bar.label,
      type: 'Mensal',
      value: bar.monthly
    });

    chartHitAreas.push({
      x: annualX,
      y: annualY,
      width: barWidth,
      height: chartBottom - annualY,
      label: bar.label,
      type: 'Anual',
      value: bar.annual
    });
  }

  bars.forEach(drawBarGroup);

  bars.forEach((bar) => {
    const label = bar.label.length > 14 ? `${bar.label.slice(0, 13)}...` : bar.label;
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.fillText(label, bar.x, 224);
  });

  context.textAlign = 'left';
  context.fillStyle = '#22c55e';
  context.fillText('Mensal', 70, 18);
  context.fillStyle = '#ffc107';
  context.fillText('Anual', 140, 18);
}

function hideChartTooltip() {
  chartTooltip.style.display = 'none';
}

function showChartTooltip(event) {
  if (chartPanel.hidden) {
    hideChartTooltip();
    return;
  }

  const rect = costChart.getBoundingClientRect();
  const scaleX = Number(costChart.style.width.replace('px', '')) / rect.width;
  const scaleY = 260 / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const hit = chartHitAreas.find((area) => (
    x >= area.x
    && x <= area.x + area.width
    && y >= area.y
    && y <= area.y + area.height
  ));

  if (!hit) {
    hideChartTooltip();
    return;
  }

  const shellRect = chartShell.getBoundingClientRect();
  chartTooltip.innerHTML = `
    <strong>${escapeHtml(hit.label)}</strong><br>
    ${hit.type}: ${currencyFormatter.format(hit.value)}
  `;
  chartTooltip.style.display = 'block';
  chartTooltip.style.left = `${event.clientX - shellRect.left + chartShell.scrollLeft + 12}px`;
  chartTooltip.style.top = `${event.clientY - shellRect.top + chartShell.scrollTop + 12}px`;
}

async function loadSubscriptions() {
  const subscriptions = await requestJson('/subscriptions');
  currentSubscriptions = subscriptions;
  renderRows(subscriptions);
  drawChart(subscriptions);
  showDueAlerts(subscriptions);
  await loadSummary();
}

function fillForm(subscription) {
  subscriptionId.value = subscription.id;
  nameInput.value = subscription.name;
  priceInput.value = subscription.price;
  dueDateInput.value = subscription.due_date;
  periodInput.value = subscription.period;
  sharedInput.checked = subscription.shared === 1;
  myShareInput.value = subscription.my_share;
  formTitle.textContent = 'Editar assinatura';
  document.body.classList.add('is-editing');
  updateShareState();
  nameInput.focus();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const id = subscriptionId.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/subscriptions/${id}` : '/subscriptions';

    await requestJson(url, {
      method,
      body: JSON.stringify(buildPayload())
    });

    showAlert(id ? 'Assinatura atualizada com sucesso.' : 'Assinatura cadastrada com sucesso.');
    resetForm();
    await loadSubscriptions();
  } catch (error) {
    showAlert(error.message, 'danger');
  }
});

tableBody.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');

  if (!button) {
    return;
  }

  const id = Number(button.dataset.id);
  const row = button.closest('tr');
  const action = button.dataset.action;

  if (action === 'edit') {
    const subscription = currentSubscriptions.find((item) => item.id === id);

    if (subscription) {
      fillForm(subscription);
    }
  }

  if (action === 'renew') {
    const subscription = currentSubscriptions.find((item) => item.id === id);

    if (!subscription) {
      return;
    }

    const nextDueDate = getNextDueDate(subscription.due_date, subscription.period);

    try {
      await requestJson(`/subscriptions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: subscription.name,
          price: subscription.price,
          due_date: nextDueDate,
          period: subscription.period,
          shared: subscription.shared === 1,
          my_share: subscription.my_share
        })
      });
      showAlert(`Assinatura renovada para ${nextDueDate}.`);
      await loadSubscriptions();
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  }

  if (action === 'delete') {
    const name = row.querySelector('strong').textContent;

    if (!confirm(`Cancelar ${name}?`)) {
      return;
    }

    try {
      await requestJson(`/subscriptions/${id}`, { method: 'DELETE' });
      showAlert('Assinatura cancelada com sucesso.');
      await loadSubscriptions();
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  }
});

sharedInput.addEventListener('change', updateShareState);
priceInput.addEventListener('input', updateShareState);
cancelEditButton.addEventListener('click', resetForm);
reloadButton.addEventListener('click', loadSubscriptions);
chartToggleButton.addEventListener('click', () => {
  chartPanel.hidden = !chartPanel.hidden;
  chartToggleButton.classList.toggle('btn-success', !chartPanel.hidden);
  chartToggleButton.classList.toggle('btn-outline-success', chartPanel.hidden);
  hideChartTooltip();
  drawChart(currentSubscriptions);
});
window.addEventListener('resize', () => drawChart(currentSubscriptions));
costChart.addEventListener('mousemove', showChartTooltip);
costChart.addEventListener('mouseleave', hideChartTooltip);

resetForm();
loadSubscriptions().catch((error) => showAlert(error.message, 'danger'));
