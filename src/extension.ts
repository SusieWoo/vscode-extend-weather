// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "shenyang-weather" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('shenyang-weather.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from shenyang-weather!');
	// });
	// 沈阳天气代码：
	let cityAqi = vscode.commands.registerCommand('shenyang-weather.helloWorld',() => {
		const options = {
			ignoreFocusOut: true,
			password: false,
			prompt: "Please type your city (eg.shenyang or 沈阳)"
		};
		vscode.window.showInputBox(options)
		.then((value)=>{
			if (value === undefined || value.trim() === '') {
				vscode.window.showInformationMessage('Please type your city.');
			}
			else {
				const cityName = value.trim();
				axios.get(`https://way.jd.com/he/freeweather?city=${cityName}&appkey=8df35663f00057ef27daba5ad316d045`)
					.then((rep)=>{	
						vscode.window.showInformationMessage(JSON.stringify(rep));
						if(rep.data.code !== '10000') {
							vscode.window.showInformationMessage('Sorry, Please try again.');
							return;
						}
						const weatherData = rep.data.result.HeWeather5[0];
							if(weatherData.status !== 'ok') {
							vscode.window.showInformationMessage(`Sorry, ${weatherData.status}`);
							return;
						}
						vscode.window.showInformationMessage(`${weatherData.city} 's weather: ${weatherData.weather}, temphigh: ${weatherData.temphigh}, templow: ${weatherData.templow}  `);
					}).catch((err)=>{
						vscode.window.showInformationMessage(`error, ${JSON.stringify(err)}`);
					});
				}
			});

	});
	context.subscriptions.push(cityAqi);
	// context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
