﻿/// <reference path="../../Scripts/CqsClient.ts" />
/// <reference path="../../Scripts/Griffin.Yo.d.ts" />

module OneTrueError.User {
    var cqs = Griffin.Cqs.CqsClient;
    import Yo = Griffin.Yo;
    import UserSettingsResult = Core.Users.Queries.GetUserSettingsResult;
    import GetUserSettings = Core.Users.Queries.GetUserSettings;
    import CqsClient = Griffin.Cqs.CqsClient;

    export class SettingsViewModel implements Griffin.Yo.Spa.ViewModels.IViewModel {
        private notifyNewIncident: boolean;
        private notifyNewReport: boolean;
        private notifyReOpenedIncident: boolean;
        private notifyPeaks: boolean;
        private context: Griffin.Yo.Spa.ViewModels.IActivationContext;

        constructor() {
        }

        changePassword_click(e: any) {
            e.preventDefault();
            var dto = this.context.readForm("PasswordView");
            if (dto.NewPassword !== dto.NewPassword2) {
                humane.error("New passwords do not match.");
                return;
            }
            if (!dto.CurrentPassword) {
                humane.error("You must enter the current password.");
                return;
            }

            var cmd = new Core.Accounts.Requests.ChangePassword(dto.CurrentPassword, dto.NewPassword);
            CqsClient.request<Core.Accounts.Requests.ChangePasswordReply>(cmd)
                .done(result => {
                    if (result.Success) {
                        this.context.render({ NewPassword: "", NewPassword2: "", CurrentPassword: "" });
                        humane.log("Password have been changed.");
                    } else {
                        humane.error("Password could not be changed. Did you enter your current password correctly?");
                    }
                });

        }

        saveSettings_click(e: any) {
            e.isHandled = true;
            var dto = this.context.readForm("PersonalSettings");
            var cmd = new Core.Users.Commands.UpdatePersonalSettings();
            cmd.FirstName = dto.FirstName;
            cmd.LastName = dto.LastName;
            cmd.MobileNumber = dto.MobileNumber;
            CqsClient.command(cmd);
            humane.log("Settings have been saved.");
        }

        getTitle(): string { return "Personal settings"; }

        activate(context: Griffin.Yo.Spa.ViewModels.IActivationContext): void {
            this.context = context;

            context.handle.click("[name=\"saveSettings\"]", ev => this.saveSettings_click(ev));
            context.handle.click("[name='changePassword']", ev => this.changePassword_click(ev));
            var query = new Core.Users.Queries.GetUserSettings();
            cqs.query<Core.Users.Queries.GetUserSettingsResult>(query).done(result => {
                context.render(result);
                context.resolve();
            });

        }

        deactivate() {

        }

    }
}