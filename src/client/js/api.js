import { toggleLoading, showAlert } from './ui.js';

export async function handleFormSubmit(url, bodyData, successCallback) {
  toggleLoading(true);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });
    const data = await res.json();
    toggleLoading(false);

    if (data.success) {
      showAlert(data.message, 'success');
      if (successCallback) successCallback(data);
    } else {
      showAlert(data.message, 'danger');
    }
  } catch (err) {
    toggleLoading(false);
    showAlert('Lỗi kết nối máy chủ!', 'danger');
  }
}