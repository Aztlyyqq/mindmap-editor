const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
let mainWindow = null;

// 单实例锁，避免多开
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1440,
      height: 900,
      minWidth: 1000,
      minHeight: 640,
      title: '思维导图编辑器',
      backgroundColor: '#f0f2f5',
      autoHideMenuBar: false,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        spellcheck: false
      }
    });
    mainWindow.loadFile('index.html');

    // 外部链接用系统浏览器打开
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('http')) { shell.openExternal(url); return { action: 'deny' }; }
      return { action: 'allow' };
    });

    // 导出 PNG：拦截网页下载，弹出系统保存对话框
    mainWindow.webContents.session.on('will-download', (event, item) => {
      const defaultName = item.getFilename() || '思维导图.png';
      dialog.showSaveDialog(mainWindow, {
        title: '保存图片',
        defaultPath: path.join(app.getPath('downloads'), defaultName),
        filters: [{ name: 'PNG 图片', extensions: ['png'] }]
      }).then(result => {
        if (result.canceled || !result.filePath) {
          item.cancel();
          return;
        }
        item.setSavePath(result.filePath);
      }).catch(() => item.cancel());
    });

    mainWindow.on('closed', () => { mainWindow = null; });
  }

  // 精简中文菜单
  function buildMenu() {
    const template = [
      {
        label: '文件',
        submenu: [
          { role: 'reload', label: '重新加载' },
          { type: 'separator' },
          { role: 'quit', label: '退出' }
        ]
      },
      {
        label: '编辑',
        submenu: [
          { role: 'undo', label: '撤销' },
          { role: 'redo', label: '重做' },
          { type: 'separator' },
          { role: 'cut', label: '剪切' },
          { role: 'copy', label: '复制' },
          { role: 'paste', label: '粘贴' },
          { role: 'selectAll', label: '全选' }
        ]
      },
      {
        label: '视图',
        submenu: [
          { role: 'zoomIn', label: '放大' },
          { role: 'zoomOut', label: '缩小' },
          { role: 'resetZoom', label: '重置缩放' },
          { type: 'separator' },
          { role: 'togglefullscreen', label: '全屏' }
        ]
      },
      {
        label: '帮助',
        submenu: [
          {
            label: '关于思维导图编辑器',
            click: () => {
              dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: '关于',
                message: '思维导图编辑器',
                detail: '版本 1.0.0\n本地离线运行，数据保存在本机。'
              });
            }
          }
        ]
      }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }

  app.whenReady().then(() => {
    buildMenu();
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
