// オプションを保存する関数
function saveOptions() {
  const copyDelay = document.getElementById('copyDelay').value;

  chrome.storage.sync.set({
    copyDelay: parseInt(copyDelay, 10)
  }, function() {
    console.log('オプションが保存されました');
  });
}

// オプションを読み込む関数
function restoreOptions() {
  chrome.storage.sync.get({
    copyDelay: 500
  }, function(items) {
    document.getElementById('copyDelay').value = items.copyDelay;
  });
}

// イベントリスナーを設定
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);