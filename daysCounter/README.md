# Days Counter PCF
### Author: Raphael Zaneti

### Overview
This is a PCF Component for calculating the number of days relative to the current date. It allows users to edit and save the base date of a Dataverse Table column, and customize warning/danger messages. 

From the App Maker/Developer's perspective, you can define the base date for day counting, specify whether a higher or lower number of days is favorable, and customize warning/danger messages, along with setting label and text colors for a better visual.

This is how the component looks like:
![overview](https://github.com/raphaelzaneti/pcf-gallery/blob/main/dateCounter/daysCounter/img/overview.png?raw=true)

The component contains basically three main elements:
- **Date picker (in red):** allows the user to visualize and change the date, defined by the "Date" propety, as detailed later in this instructions. 
- **Days counter label (in green):** counts the difference between the base date, set by the "Date" property, and today.
- **Warning/danger label (in blue):** flags a warning or danger message to the user. 


### Testing the PCF in your local environment
If you want to test the component in your local environment, clone or download this repository, open you terminal in the respective folder and run the following commands:

```
npm install
npm run build
npm start:watch
```

### Import PCF to your Power Platform environment
For a quick start with the PCF, download the managed solution and import it to your Power Platform environment. If you don't know how to import managed solutions, follow the steps described [here](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/import-update-export-solutions).


### Properties

#### Date
This property defines the base date for counting and must be a Dataverse column of **Date Only** data type.

For example, you can use a **Project deadline** column as input, allowing the PCF to calculate the number of days between this date and the current date.

### Count-up or Countdown
This property determines whether the counter will count down the days (when the base date is **after** the current date) or count up (when the base date **has already passed**).

Typically, use countdowns to track deadlines, such as task delivery dates, event schedules, or application deadlines. Use count-ups to highlight how many days have passed since the base date, like in delayed deliveries.  

#### Warning days qty
This property defines the number of days to display the warning message label. For countdowns, the warning days must be **greater than the danger days**, while for count-ups, it must be **less than the danger days**.

The input for this property must be a whole positive number, with a default value of zero. Negative values will automatically be converted to positive.

#### Warning label color
This property sets the background color for the warning label. You can enter colors in hexadecimal format (e.g., ccc or f0f0f0, without needing the #), or use standard color names such as "red," "aqua," or "magenta." If left blank or if an invalid value is entered, the default color (gold) will be applied.

#### Warning label text
This property stores a custom text for the warning label. You can enter any message without a character limit, but for optimal design, it’s recommended to keep it under 20 characters. The default value is "Warning."

#### Warning label text color
This property sets the text color for the warning label. You can enter either hexadecimal values like #ccc or #f0f0f0 (without the "#"), or simply use named colors like "red," "aqua," or "magenta." If no input or an invalid color is provided, the default color (black) will be used.

### Danger days qty
This property defines the number of days to display the danger message label. For countdowns, the danger days must be **greater than the warning days**, while for count-ups, it must be **less than the warning days**.

The input for this property must be a whole positive number, with a default value of zero. Negative values will automatically be converted to positive.

#### Danger label color
This property sets the background color for the danger label. You can enter colors in hexadecimal format (e.g., ccc or f0f0f0, without needing the #), or use standard color names such as "red," "aqua," or "magenta." If left blank or if an invalid value is entered, the default color (red) will be applied.

#### Danger label text
This property stores a custom text for the danger label. You can enter any message without a character limit, but for optimal design, it’s recommended to keep it under 20 characters. The default value is "Danger."

#### Danger label text color
This property sets the text color for the danger label. You can enter either hexadecimal values like #ccc or #f0f0f0 (without the "#"), or simply use named colors like "red," "aqua," or "magenta." If no input or an invalid color is provided, the default color (black) will be used.

### Stop days qty
This property defines the number of days after which the warning or danger labels will stop displaying. For countdowns, the value must be **less than** the warning/danger days quantity. For count-ups, the value must be **greater than** the warning/danger days quantity. The default value is zero.


### Examples
Overview of the component without any label, as the counting directions is set to countdown and date difference is above the warning threshold (10 days):


Warning label containing dynamic message (Close to due), text color (fff) and background color (orange): 
![img](https://github.com/raphaelzaneti/pcf-gallery/blob/main/dateCounter/daysCounter/img/warning%20label%20in%20form.png?raw=true)

Warning label in form:


Danger label containg dynamic messge (VERY CLOSE TO DUE!), text color (f00) and background color (yellow):


Danger label in form:


Form with label displayed, as the base date is equal to today (zero days difference), matching to the stop date:

