import type {
	RPCAcceptActivityInviteArgs,
	RPCAcceptActivityInviteResultData,
	RPCActivityInviteDispatchData,
	RPCActivityInviteUserArgs,
	RPCActivityInviteUserResultData,
	RPCActivityJoinDispatchData,
	RPCActivityJoinRequestDispatchData,
	RPCActivitySpectateDispatchData,
	RPCAuthenticateArgs,
	RPCAuthenticateResultData,
	RPCAuthorizeArgs,
	RPCAuthorizeResultData,
	RPCBraintreePopupBridgeCallbackArgs,
	RPCBraintreePopupBridgeCallbackResultData,
	RPCBrowserHandoffArgs,
	RPCBrowserHandoffResultData,
	RPCChannelCreateDispatchData,
	RPCCloseActivityJoinRequestArgs,
	RPCCloseActivityJoinRequestResultData,
	RPCCommandSubscribePayload,
	RPCCommands,
	RPCConnectionsCallbackArgs,
	RPCConnectionsCallbackResultData,
	RPCCreateChannelInviteArgs,
	RPCCreateChannelInviteResultData,
	RPCCurrentUserUpdateDispatchData,
	RPCDeepLinkArgs,
	RPCDeepLinkResultData,
	RPCEntitlementCreateDispatchData,
	RPCEntitlementDeleteDispatchData,
	RPCErrorDispatchData,
	RPCEvents,
	RPCGameJoinDispatchData,
	RPCGameSpectateDispatchData,
	RPCGetApplicationTicketArgs,
	RPCGetApplicationTicketResultData,
	RPCGetChannelArgs,
	RPCGetChannelResultData,
	RPCGetChannelsArgs,
	RPCGetChannelsResultData,
	RPCGetEntitlementTicketArgs,
	RPCGetEntitlementTicketResultData,
	RPCGetEntitlementsArgs,
	RPCGetEntitlementsResultData,
	RPCGetGuildArgs,
	RPCGetGuildResultData,
	RPCGetGuildsArgs,
	RPCGetGuildsResultData,
	RPCGetImageArgs,
	RPCGetImageResultData,
	RPCGetNetworkingConfigArgs,
	RPCGetNetworkingConfigResultData,
	RPCGetRelationshipsArgs,
	RPCGetRelationshipsResultData,
	RPCGetSelectedVoiceChannelArgs,
	RPCGetSelectedVoiceChannelResultData,
	RPCGetSkusArgs,
	RPCGetSkusResultData,
	RPCGetUserArgs,
	RPCGetUserResultData,
	RPCGetVoiceSettingsArgs,
	RPCGetVoiceSettingsResultData,
	RPCGiftCodeBrowserArgs,
	RPCGiftCodeBrowserResultData,
	RPCGuildCreateDispatchData,
	RPCGuildStatusDispatchData,
	RPCGuildTemplateBrowserArgs,
	RPCGuildTemplateBrowserResultData,
	RPCInviteBrowserArgs,
	RPCInviteBrowserResultData,
	RPCMessageCreateDispatchData,
	RPCMessageDeleteDispatchData,
	RPCMessageUpdateDispatchData,
	RPCNetworkingCreateTokenArgs,
	RPCNetworkingCreateTokenResultData,
	RPCNetworkingPeerMetricsArgs,
	RPCNetworkingPeerMetricsResultData,
	RPCNetworkingSystemMetricsArgs,
	RPCNetworkingSystemMetricsResultData,
	RPCNotificationCreateDispatchData,
	RPCOpenOverlayActivityInviteArgs,
	RPCOpenOverlayActivityInviteResultData,
	RPCOpenOverlayGuildInviteArgs,
	RPCOpenOverlayGuildInviteResultData,
	RPCOpenOverlayVoiceSettingsArgs,
	RPCOpenOverlayVoiceSettingsResultData,
	RPCOverlayArgs,
	RPCOverlayDispatchData,
	RPCOverlayResultData,
	RPCOverlayUpdateDispatchData,
	RPCReadyDispatchData,
	RPCRelationshipUpdateDispatchData,
	RPCSelectTextChannelArgs,
	RPCSelectTextChannelResultData,
	RPCSelectVoiceChannelArgs,
	RPCSelectVoiceChannelResultData,
	RPCSendActivityJoinInviteArgs,
	RPCSendActivityJoinInviteResultData,
	RPCSetActivityArgs,
	RPCSetActivityResultData,
	RPCSetCertifiedDevicesArgs,
	RPCSetCertifiedDevicesResultData,
	RPCSetOverlayLockedArgs,
	RPCSetOverlayLockedResultData,
	RPCSetUserVoiceSettings2Args,
	RPCSetUserVoiceSettings2ResultData,
	RPCSetUserVoiceSettingsArgs,
	RPCSetUserVoiceSettingsResultData,
	RPCSetVoiceSettings2Args,
	RPCSetVoiceSettings2ResultData,
	RPCSetVoiceSettingsArgs,
	RPCSetVoiceSettingsResultData,
	RPCSpeakingStartDispatchData,
	RPCSpeakingStopDispatchData,
	RPCStartPurchaseArgs,
	RPCStartPurchaseResultData,
	RPCSubscribeActivityInviteArgs,
	RPCSubscribeActivityJoinArgs,
	RPCSubscribeActivityJoinRequestArgs,
	RPCSubscribeActivitySpectateArgs,
	RPCSubscribeChannelCreateArgs,
	RPCSubscribeCurrentUserUpdateArgs,
	RPCSubscribeEntitlementCreateArgs,
	RPCSubscribeEntitlementDeleteArgs,
	RPCSubscribeGameJoinArgs,
	RPCSubscribeGameSpectateArgs,
	RPCSubscribeGuildCreateArgs,
	RPCSubscribeGuildStatusArgs,
	RPCSubscribeMessageCreateArgs,
	RPCSubscribeMessageDeleteArgs,
	RPCSubscribeMessageUpdateArgs,
	RPCSubscribeNotificationCreateArgs,
	RPCSubscribeOverlayArgs,
	RPCSubscribeOverlayUpdateArgs,
	RPCSubscribeRelationshipUpdateArgs,
	RPCSubscribeResultData,
	RPCSubscribeSpeakingStartArgs,
	RPCSubscribeSpeakingStopArgs,
	RPCSubscribeVoiceChannelSelectArgs,
	RPCSubscribeVoiceConnectionStatusArgs,
	RPCSubscribeVoiceSettingsUpdate2Args,
	RPCSubscribeVoiceSettingsUpdateArgs,
	RPCSubscribeVoiceStateCreateArgs,
	RPCSubscribeVoiceStateDeleteArgs,
	RPCSubscribeVoiceStateUpdateArgs,
	RPCValidateApplicationArgs,
	RPCValidateApplicationResultData,
	RPCVoiceChannelSelectDispatchData,
	RPCVoiceConnectionStatusDispatchData,
	RPCVoiceSettingsUpdate2DispatchData,
	RPCVoiceSettingsUpdateDispatchData,
	RPCVoiceStateCreateDispatchData,
	RPCVoiceStateDeleteDispatchData,
	RPCVoiceStateUpdateDispatchData,
} from 'discord-api-types/v10';

export enum Events {
	ApplicationReady = 'ready',
	Disconnected = 'disconnected',
}

export interface MappedRPCCommandsResultsData {
	[RPCCommands.Authorize]: RPCAuthorizeResultData;
	[RPCCommands.Authenticate]: RPCAuthenticateResultData;
	[RPCCommands.GetChannel]: RPCGetChannelResultData;
	[RPCCommands.GetChannels]: RPCGetChannelsResultData;
	[RPCCommands.GetGuild]: RPCGetGuildResultData;
	[RPCCommands.GetGuilds]: RPCGetGuildsResultData;
	[RPCCommands.GetUser]: RPCGetUserResultData;
	[RPCCommands.GetVoiceSettings]: RPCGetVoiceSettingsResultData;
	[RPCCommands.SelectTextChannel]: RPCSelectTextChannelResultData;
	[RPCCommands.SelectVoiceChannel]: RPCSelectVoiceChannelResultData;
	[RPCCommands.SetActivity]: RPCSetActivityResultData;
	[RPCCommands.SetVoiceSettings]: RPCSetVoiceSettingsResultData;
	[RPCCommands.Subscribe]: RPCSubscribeResultData;
	[RPCCommands.Unsubscribe]: RPCSubscribeResultData;
	[RPCCommands.AcceptActivityInvite]: RPCAcceptActivityInviteResultData;
	[RPCCommands.ActivityInviteUser]: RPCActivityInviteUserResultData;
	[RPCCommands.BraintreePopupBridgeCallback]: RPCBraintreePopupBridgeCallbackResultData;
	[RPCCommands.BrowserHandoff]: RPCBrowserHandoffResultData;
	[RPCCommands.CloseActivityJoinRequest]: RPCCloseActivityJoinRequestResultData;
	[RPCCommands.ConnectionsCallback]: RPCConnectionsCallbackResultData;
	[RPCCommands.CreateChannelInvite]: RPCCreateChannelInviteResultData;
	[RPCCommands.DeepLink]: RPCDeepLinkResultData;
	[RPCCommands.GetApplicationTicket]: RPCGetApplicationTicketResultData;
	[RPCCommands.GetEntitlementTicket]: RPCGetEntitlementTicketResultData;
	[RPCCommands.GetEntitlements]: RPCGetEntitlementsResultData;
	[RPCCommands.GetImage]: RPCGetImageResultData;
	[RPCCommands.GetNetworkingConfig]: RPCGetNetworkingConfigResultData;
	[RPCCommands.GetRelationships]: RPCGetRelationshipsResultData;
	[RPCCommands.GetSelectedVoiceChannel]: RPCGetSelectedVoiceChannelResultData;
	[RPCCommands.GetSkus]: RPCGetSkusResultData;
	[RPCCommands.GiftCodeBrowser]: RPCGiftCodeBrowserResultData;
	[RPCCommands.GuildTemplateBrowser]: RPCGuildTemplateBrowserResultData;
	[RPCCommands.InviteBrowser]: RPCInviteBrowserResultData;
	[RPCCommands.NetworkingCreateToken]: RPCNetworkingCreateTokenResultData;
	[RPCCommands.NetworkingPeerMetrics]: RPCNetworkingPeerMetricsResultData;
	[RPCCommands.NetworkingSystemMetrics]: RPCNetworkingSystemMetricsResultData;
	[RPCCommands.OpenOverlayActivityInvite]: RPCOpenOverlayActivityInviteResultData;
	[RPCCommands.OpenOverlayGuildInvite]: RPCOpenOverlayGuildInviteResultData;
	[RPCCommands.OpenOverlayVoiceSettings]: RPCOpenOverlayVoiceSettingsResultData;
	[RPCCommands.Overlay]: RPCOverlayResultData;
	[RPCCommands.SendActivityJoinInvite]: RPCSendActivityJoinInviteResultData;
	[RPCCommands.SetCertifiedDevices]: RPCSetCertifiedDevicesResultData;
	[RPCCommands.SetOverlayLocked]: RPCSetOverlayLockedResultData;
	[RPCCommands.SetUserVoiceSettings]: RPCSetUserVoiceSettingsResultData;
	[RPCCommands.SetUserVoiceSettings2]: RPCSetUserVoiceSettings2ResultData;
	[RPCCommands.SetVoiceSettings2]: RPCSetVoiceSettings2ResultData;
	[RPCCommands.StartPurchase]: RPCStartPurchaseResultData;
	[RPCCommands.ValidateApplication]: RPCValidateApplicationResultData;
}

export interface MappedRPCCommandsArgs {
	[RPCCommands.Authorize]: RPCAuthorizeArgs;
	[RPCCommands.Authenticate]: RPCAuthenticateArgs;
	[RPCCommands.GetChannel]: RPCGetChannelArgs;
	[RPCCommands.GetChannels]: RPCGetChannelsArgs;
	[RPCCommands.GetGuild]: RPCGetGuildArgs;
	[RPCCommands.GetGuilds]: RPCGetGuildsArgs;
	[RPCCommands.GetUser]: RPCGetUserArgs;
	[RPCCommands.GetVoiceSettings]: RPCGetVoiceSettingsArgs;
	[RPCCommands.SelectTextChannel]: RPCSelectTextChannelArgs;
	[RPCCommands.SelectVoiceChannel]: RPCSelectVoiceChannelArgs;
	[RPCCommands.SetActivity]: RPCSetActivityArgs;
	[RPCCommands.SetVoiceSettings]: RPCSetVoiceSettingsArgs;
	[RPCCommands.Subscribe]: RPCCommandSubscribePayload['args'];
	[RPCCommands.Unsubscribe]: RPCCommandSubscribePayload['args'];
	[RPCCommands.AcceptActivityInvite]: RPCAcceptActivityInviteArgs;
	[RPCCommands.ActivityInviteUser]: RPCActivityInviteUserArgs;
	[RPCCommands.BraintreePopupBridgeCallback]: RPCBraintreePopupBridgeCallbackArgs;
	[RPCCommands.BrowserHandoff]: RPCBrowserHandoffArgs;
	[RPCCommands.CloseActivityJoinRequest]: RPCCloseActivityJoinRequestArgs;
	[RPCCommands.ConnectionsCallback]: RPCConnectionsCallbackArgs;
	[RPCCommands.CreateChannelInvite]: RPCCreateChannelInviteArgs;
	[RPCCommands.DeepLink]: RPCDeepLinkArgs;
	[RPCCommands.GetApplicationTicket]: RPCGetApplicationTicketArgs;
	[RPCCommands.GetEntitlementTicket]: RPCGetEntitlementTicketArgs;
	[RPCCommands.GetEntitlements]: RPCGetEntitlementsArgs;
	[RPCCommands.GetImage]: RPCGetImageArgs;
	[RPCCommands.GetNetworkingConfig]: RPCGetNetworkingConfigArgs;
	[RPCCommands.GetRelationships]: RPCGetRelationshipsArgs;
	[RPCCommands.GetSelectedVoiceChannel]: RPCGetSelectedVoiceChannelArgs;
	[RPCCommands.GetSkus]: RPCGetSkusArgs;
	[RPCCommands.GiftCodeBrowser]: RPCGiftCodeBrowserArgs;
	[RPCCommands.GuildTemplateBrowser]: RPCGuildTemplateBrowserArgs;
	[RPCCommands.InviteBrowser]: RPCInviteBrowserArgs;
	[RPCCommands.NetworkingCreateToken]: RPCNetworkingCreateTokenArgs;
	[RPCCommands.NetworkingPeerMetrics]: RPCNetworkingPeerMetricsArgs;
	[RPCCommands.NetworkingSystemMetrics]: RPCNetworkingSystemMetricsArgs;
	[RPCCommands.OpenOverlayActivityInvite]: RPCOpenOverlayActivityInviteArgs;
	[RPCCommands.OpenOverlayGuildInvite]: RPCOpenOverlayGuildInviteArgs;
	[RPCCommands.OpenOverlayVoiceSettings]: RPCOpenOverlayVoiceSettingsArgs;
	[RPCCommands.Overlay]: RPCOverlayArgs;
	[RPCCommands.SendActivityJoinInvite]: RPCSendActivityJoinInviteArgs;
	[RPCCommands.SetCertifiedDevices]: RPCSetCertifiedDevicesArgs;
	[RPCCommands.SetOverlayLocked]: RPCSetOverlayLockedArgs;
	[RPCCommands.SetUserVoiceSettings]: RPCSetUserVoiceSettingsArgs;
	[RPCCommands.SetUserVoiceSettings2]: RPCSetUserVoiceSettings2Args;
	[RPCCommands.SetVoiceSettings2]: RPCSetVoiceSettings2Args;
	[RPCCommands.StartPurchase]: RPCStartPurchaseArgs;
	[RPCCommands.ValidateApplication]: RPCValidateApplicationArgs;
}

export type RPCCallableCommands = Exclude<RPCCommands, RPCCommands.Dispatch>;

export interface MappedRPCSubscribeEventsArgs {
	[RPCEvents.Ready]: Record<string, never>;
	[RPCEvents.Error]: Record<string, never>;
	[RPCEvents.ActivityInvite]: RPCSubscribeActivityInviteArgs;
	[RPCEvents.ActivityJoin]: RPCSubscribeActivityJoinArgs;
	[RPCEvents.ActivityJoinRequest]: RPCSubscribeActivityJoinRequestArgs;
	[RPCEvents.ActivitySpectate]: RPCSubscribeActivitySpectateArgs;
	[RPCEvents.ChannelCreate]: RPCSubscribeChannelCreateArgs;
	[RPCEvents.CurrentUserUpdate]: RPCSubscribeCurrentUserUpdateArgs;
	[RPCEvents.EntitlementCreate]: RPCSubscribeEntitlementCreateArgs;
	[RPCEvents.EntitlementDelete]: RPCSubscribeEntitlementDeleteArgs;
	[RPCEvents.GameJoin]: RPCSubscribeGameJoinArgs;
	[RPCEvents.GameSpectate]: RPCSubscribeGameSpectateArgs;
	[RPCEvents.GuildCreate]: RPCSubscribeGuildCreateArgs;
	[RPCEvents.GuildStatus]: RPCSubscribeGuildStatusArgs;
	[RPCEvents.MessageCreate]: RPCSubscribeMessageCreateArgs;
	[RPCEvents.MessageDelete]: RPCSubscribeMessageDeleteArgs;
	[RPCEvents.MessageUpdate]: RPCSubscribeMessageUpdateArgs;
	[RPCEvents.NotificationCreate]: RPCSubscribeNotificationCreateArgs;
	[RPCEvents.Overlay]: RPCSubscribeOverlayArgs;
	[RPCEvents.OverlayUpdate]: RPCSubscribeOverlayUpdateArgs;
	[RPCEvents.RelationshipUpdate]: RPCSubscribeRelationshipUpdateArgs;
	[RPCEvents.SpeakingStart]: RPCSubscribeSpeakingStartArgs;
	[RPCEvents.SpeakingStop]: RPCSubscribeSpeakingStopArgs;
	[RPCEvents.VoiceChannelSelect]: RPCSubscribeVoiceChannelSelectArgs;
	[RPCEvents.VoiceConnectionStatus]: RPCSubscribeVoiceConnectionStatusArgs;
	[RPCEvents.VoiceSettingsUpdate]: RPCSubscribeVoiceSettingsUpdateArgs;
	[RPCEvents.VoiceSettingsUpdate2]: RPCSubscribeVoiceSettingsUpdate2Args;
	[RPCEvents.VoiceStateCreate]: RPCSubscribeVoiceStateCreateArgs;
	[RPCEvents.VoiceStateDelete]: RPCSubscribeVoiceStateDeleteArgs;
	[RPCEvents.VoiceStateUpdate]: RPCSubscribeVoiceStateUpdateArgs;
}

export interface MappedRPCEventsDispatchData {
	[RPCEvents.ActivityInvite]: [RPCActivityInviteDispatchData];
	[RPCEvents.ActivityJoin]: [RPCActivityJoinDispatchData];
	[RPCEvents.ActivityJoinRequest]: [RPCActivityJoinRequestDispatchData];
	[RPCEvents.ActivitySpectate]: [RPCActivitySpectateDispatchData];
	[RPCEvents.ChannelCreate]: [RPCChannelCreateDispatchData];
	[RPCEvents.CurrentUserUpdate]: [RPCCurrentUserUpdateDispatchData];
	[RPCEvents.EntitlementCreate]: [RPCEntitlementCreateDispatchData];
	[RPCEvents.EntitlementDelete]: [RPCEntitlementDeleteDispatchData];
	[RPCEvents.Error]: [RPCErrorDispatchData];
	[RPCEvents.GameJoin]: [RPCGameJoinDispatchData];
	[RPCEvents.GameSpectate]: [RPCGameSpectateDispatchData];
	[RPCEvents.GuildCreate]: [RPCGuildCreateDispatchData];
	[RPCEvents.GuildStatus]: [RPCGuildStatusDispatchData];
	[RPCEvents.MessageCreate]: [RPCMessageCreateDispatchData];
	[RPCEvents.MessageDelete]: [RPCMessageDeleteDispatchData];
	[RPCEvents.MessageUpdate]: [RPCMessageUpdateDispatchData];
	[RPCEvents.NotificationCreate]: [RPCNotificationCreateDispatchData];
	[RPCEvents.Overlay]: [RPCOverlayDispatchData];
	[RPCEvents.OverlayUpdate]: [RPCOverlayUpdateDispatchData];
	[RPCEvents.Ready]: [RPCReadyDispatchData];
	[RPCEvents.RelationshipUpdate]: [RPCRelationshipUpdateDispatchData];
	[RPCEvents.SpeakingStart]: [RPCSpeakingStartDispatchData];
	[RPCEvents.SpeakingStop]: [RPCSpeakingStopDispatchData];
	[RPCEvents.VoiceChannelSelect]: [RPCVoiceChannelSelectDispatchData];
	[RPCEvents.VoiceConnectionStatus]: [RPCVoiceConnectionStatusDispatchData];
	[RPCEvents.VoiceSettingsUpdate]: [RPCVoiceSettingsUpdateDispatchData];
	[RPCEvents.VoiceSettingsUpdate2]: [RPCVoiceSettingsUpdate2DispatchData];
	[RPCEvents.VoiceStateCreate]: [RPCVoiceStateCreateDispatchData];
	[RPCEvents.VoiceStateDelete]: [RPCVoiceStateDeleteDispatchData];
	[RPCEvents.VoiceStateUpdate]: [RPCVoiceStateUpdateDispatchData];
}

export type EventAndArgsParameters<Evt extends RPCEvents> =
	MappedRPCSubscribeEventsArgs[Evt] extends Record<string, never> ? [Evt] : [Evt, MappedRPCSubscribeEventsArgs[Evt]];

export type Nullable<Type> = Type | null | undefined;

export type NullableFields<Type> = {
	[FieldKey in keyof Type]: Nullable<Type[FieldKey]>;
};
