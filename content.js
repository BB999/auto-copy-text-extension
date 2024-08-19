// オプション設定を読み込む関数
function loadOptions(callback) {
  chrome.storage.sync.get({
    copyDelay: 500
  }, callback);
}

// ポップアップを表示する関数
function showPopup() {
  const popup = document.createElement('div');
  popup.textContent = 'クリップボードに保存しました';
  popup.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #4CAF50; 
    color: white;
    padding: 10px;
    border-radius: 5px;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  `;
  document.body.appendChild(popup);

  // フェードインアニメーション
  requestAnimationFrame(() => {
    popup.style.opacity = '1';
  });

  // 2秒後にフェードアウトして削除
  setTimeout(() => {
    popup.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 300);
  }, 2000);
}

// マウスアップイベントのリスナー
document.addEventListener('mouseup', function(event) {
  // 右クリックの場合は処理しない
  if (event.button === 2) return;

  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (selectedText !== '') {
    loadOptions(function(options) {
      // コピー処理とポップアップ表示を同時に行う
      navigator.clipboard.writeText(selectedText).then(function() {
        console.log('テキストがクリップボードにコピーされました: ' + selectedText);
        showPopup(); // ポップアップを即座に表示
      }).catch(function(err) {
        console.error('クリップボードへのコピーに失敗しました: ', err);
      });
    });
  }
});

// オプション変更を監視
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (let key in changes) {
    let storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
});

// アイコンをクリックしたときにポップアップを表示
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      alert('Auto Copy Text\n\n選択したテキストを自動的にクリップボードにコピーします。');
    }
  });
});