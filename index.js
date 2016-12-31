'use strict';

// ** Dependencies
const electron = require('electron');
const path = require('path');
const url = require('url');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {ipcMain} = require('electron');
const fs = require('fs-extra');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {

	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 768,
		resizable: true,
		'min-width': 500,
		'min-height': 200,
		'accept-first-mouse': true,
		'title-bar-style': 'hidden'
	});

	mainWindow.maximize();

	// and load the index.html of the app.
	// mainWindow.loadURL(url.format({
	//   pathname: path.join(__dirname, 'index.html'),
	//   protocol: 'file:',
	//   slashes: true
	// }));

	// mainWindow.loadURL('http://google.com');

	mainWindow.loadURL('file://' + __dirname + '/forms/main/index.html');
	mainWindow.focus();

	// Load steps from script file after the page loads
	mainWindow.webContents.on('did-finish-load', () => {
		console.log('MAIN_FORM_LOADED');

		const steps = [];
		ipcMain.on('add-step', (e, step) => addStep(step));

		function addStep(step) {
			console.log('ADD_STEP:', step);
			steps.push(step);

			// Add to UI
			mainWindow.webContents.send('append-step', step);
		}

		function loadTestFile(path) {

			// Clear them from the UI
			steps.length = 0;
			mainWindow.webContents.send('clear-steps');

			// Remove All Steps
			const script = fs.readJsonSync(path, {throws: false});
			console.log('STEPS:', script.steps);

			script.steps.forEach(addStep);
		}

		loadTestFile('/Users/brads/Projects/crossover/tests/crossover-available-jobs.json');
	});

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {

	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	// if (process.platform !== 'darwin') {
	app.quit();
	// }
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
