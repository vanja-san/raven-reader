import {
  app,
  Menu,
  MenuItem,
  clipboard
} from 'electron'
const articleSelected = false

export function createMenu (mainWindow, i18nextMain) {
  // Create the Application's main menu
  const template = [{
    label: i18nextMain.t('Edit'),
    submenu: [{
      role: 'undo'
    },
    {
      role: 'redo'
    },
    {
      type: 'separator'
    },
    {
      role: 'cut'
    },
    {
      role: 'copy'
    },
    {
      role: 'paste'
    },
    {
      role: 'pasteandmatchstyle'
    },
    {
      role: 'delete'
    },
    {
      role: 'selectall'
    }
    ]
  },
  {
    label: i18nextMain.t('View'),
    submenu: [{
      role: 'togglefullscreen'
    }]
  },
  {
    role: 'window',
    submenu: [{
      role: 'minimize'
    },
    {
      role: 'close'
    }
    ]
  },
  {
    label: i18nextMain.t('Subscriptions'),
    submenu: [{
      label: i18nextMain.t('Add subscription'),
      accelerator: 'CmdOrCtrl+N',
      click: function () {
        mainWindow.webContents.send('Add subscription')
      }
    }]
  },
  {
    label: i18nextMain.t('Item'),
    submenu: [{
      label: i18nextMain.t('Next item'),
      accelerator: 'CmdOrCtrl+J',
      click: function () {
        mainWindow.webContents.send('Next item')
      }
    },
    {
      label: i18nextMain.t('Previous item'),
      accelerator: 'CmdOrCtrl+K',
      click: function () {
        mainWindow.webContents.send('Previous item')
      }
    },
    {
      type: 'separator'
    },
    {
      label: i18nextMain.t('Toggle read'),
      id: 'toggle-read',
      accelerator: 'CmdOrCtrl+T',
      enabled: articleSelected,
      click: function () {
        mainWindow.webContents.send('Toggle read')
      }
    },
    {
      label: i18nextMain.t('Toggle favourite'),
      id: 'toggle-favourite',
      accelerator: 'CmdOrCtrl+S',
      enabled: articleSelected,
      click: function () {
        mainWindow.webContents.send('Toggle favourite')
      }
    },
    {
      label: i18nextMain.t('Mark all read'),
      id: 'mark-all-read',
      accelerator: 'Alt+R',
      click: function () {
        mainWindow.webContents.send('Mark all read')
      }
    },
    {
      type: 'separator'
    },
    {
      label: i18nextMain.t('Save offline'),
      id: 'save-offline',
      accelerator: 'CmdOrCtrl+O',
      enabled: articleSelected,
      click: function () {
        mainWindow.webContents.send('Save offline')
      }
    },
    {
      label: i18nextMain.t('View in browser'),
      id: 'view-browser',
      accelerator: 'CmdOrCtrl+B',
      enabled: articleSelected,
      click: function () {
        mainWindow.webContents.send('View in browser')
      }
    }
    ]
  },
  {
    label: i18nextMain.t('Import and Export'),
    submenu: [{
      label: i18nextMain.t('Import subscriptions'),
      click: function () {
        mainWindow.webContents.send('Import subscriptions')
      }
    },
    {
      type: 'separator'
    },
    {
      label: i18nextMain.t('Export subscriptions'),
      click: function () {
        mainWindow.webContents.send('Export subscriptions')
      }
    }
    ]
  }
  ]

  const version = app.getVersion()

  if (process.platform === 'win32' || process.platform === 'linux') {
    template.unshift({
      label: 'Raven Reader',
      submenu: [{
        label: `Version ${version}`,
        enabled: false
      },
      {
        label: i18nextMain.t('Preferences'),
        id: 'settings',
        type: 'normal',
        accelerator: 'CmdOrCtrl+,',
        click: function () {
          mainWindow.webContents.send('Settings')
        }
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
      ]
    })
  }

  if (process.platform === 'darwin') {
    template.unshift({
      label: 'Raven Reader',
      submenu: [{
        role: 'about'
      },
      {
        label: `Version ${version}`,
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: i18nextMain.t('Preferences'),
        id: 'settings',
        accelerator: 'CmdOrCtrl+,',
        type: 'normal',
        click: function () {
          mainWindow.webContents.send('Settings')
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'services'
      },
      {
        type: 'separator'
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
      ]
    })

    // Edit menu
    template[1].submenu.push({
      type: 'separator'
    }, {
      label: i18nextMain.t('Speech'),
      submenu: [{
        role: 'startspeaking'
      },
      {
        role: 'stopspeaking'
      }
      ]
    })

    // Window menu
    template[3].submenu = [{
      role: 'close'
    },
    {
      role: 'minimize'
    },
    {
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      role: 'front'
    }
    ]
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  return menu
}

export function createCategoryMenu (categorydata, window, i18nextMain) {
  const menu = new Menu()

  menu.append(
    new MenuItem({
      label: `Mark ${categorydata.category.title} as read`,
      click () {
        window.webContents.send('category-read', categorydata)
      }
    })
  )

  if (categorydata.category.source === 'local') {
    menu.append(
      new MenuItem({
        label: i18nextMain.t('Rename folder'),
        click () {
          window.webContents.send('category-rename', categorydata)
        }
      })
    )

    menu.append(
      new MenuItem({
        type: 'separator'
      })
    )

    menu.append(
      new MenuItem({
        label: i18nextMain.t('Delete'),
        click () {
          window.webContents.send('category-delete', categorydata)
        }
      })
    )
  }

  menu.popup({ window: window })
}

export function createFeedMenu (feeddata, window, i18nextMain) {
  const menu = new Menu()
  menu.append(
    new MenuItem({
      label: i18nextMain.t('Copy feed link'),
      click () {
        clipboard.writeText(feeddata.feed.xmlurl, 'selection')
      }
    })
  )

  if (feeddata.feed.source === 'local' || typeof feeddata.feed.source === 'undefined') {
    menu.append(
      new MenuItem({
        label: `Refresh ${feeddata.feed.title} feed`,
        click () {
          window.webContents.send('refresh-feed', feeddata)
        }
      })
    )

    menu.append(
      new MenuItem({
        label: i18nextMain.t('Edit feed'),
        click () {
          window.webContents.send('edit-feed', feeddata)
        }
      })
    )
  }

  menu.append(
    new MenuItem({
      label: i18nextMain.t('Mark as read'),
      click () {
        window.webContents.send('mark-feed-read', feeddata.feed.id)
      }
    })
  )

  menu.append(
    new MenuItem({
      type: 'separator'
    })
  )

  if (feeddata.feed.source === 'local') {
    menu.append(
      new MenuItem({
        label: i18nextMain.t('Unsubscribe'),
        click () {
          window.webContents.send('unsubscribe-feed', feeddata.feed.uuid)
        }
      })
    )
  }
  menu.popup({ window: window })
}

export function createArticleItemMenu (article, window, i18nextMain) {
  const menu = new Menu()
  menu.append(new MenuItem({
    label: i18nextMain.t('Copy link'),
    click () {
      clipboard.writeText(article.article.link, 'selection')
    }
  }))
  menu.append(new MenuItem({
    type: 'separator'
  }))
  menu.append(new MenuItem({
    label: !article.article.read ? i18nextMain.t('Mark as read') : i18nextMain.t('Mark as unread'),
    click () {
      window.webContents.send('mark-read', article)
    }
  }))
  menu.append(new MenuItem({
    label: !article.article.favourite ? i18nextMain.t('Mark as favourite') : i18nextMain.t('Remove from favourite'),
    click () {
      window.webContents.send('mark-favourite', article)
    }
  }))
  menu.append(new MenuItem({
    type: 'separator'
  }))
  menu.append(new MenuItem({
    label: !article.article.offline ? i18nextMain.t('Save article') : i18nextMain.t('Remove saved article'),
    click () {
      window.webContents.send('save-article', article)
    }
  }))
  menu.popup({ window: window })
}
