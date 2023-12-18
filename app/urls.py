from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    clientPutView, clientDeleteView, GetSupplierView, PostSupplierView, PutSupplierView,
    DeleteSupplierView, GetSingleSupplierView, GetFieldsView, PostFieldView,
    GetCampaignsView, PostCampaignView, FetchSingleCampaignView, PutCampaignView,
    DeleteCampaignView, DeleteFieldsView, PutFieldView, FetchFieldView, GetBuyersView,
    PostBuyerView, FetchBuyerView, PutBuyerView, DeleteBuyerView, SendTestLeadView, PostTestCampaignView,
    GetClientsView, FetchClientDetailsView, PostClientView, GetLeadsByCampaignView,
    IngestLeadView, IngestDebtRelief, GetLeadDetails, GetAllRecentLeads, GetTimeZoneView, GetRecordsView,
    GetFiltersView, PostFilterView, PutFilterView, DeleteFilterView, FetchFilterView, AnalyticsView,
    GetSegmentationLogicView, PostSegmentationLogicView, FetchSingleSegmentationLogic, PutSegmentationLogicView,
    DeleteSegmentationLogicView, IngestHomeSecuity, DeleteLeadView
)


urlpatterns = [
    # client urls
    path("clients/", GetClientsView.as_view(), name="GetClientsView"),
    path("client-details/<int:client_id>/", FetchClientDetailsView.as_view(), name="FetchClientDetailsView"),
    path("add-client/", PostClientView.as_view(), name="PostClientView"),
    path("update-client/<int:client_id>/", clientPutView),
    path("delete-client/<int:client_id>/", clientDeleteView),
    
    # suppliers urls
    path("suppliers/<int:campaign_id>/", GetSupplierView.as_view(), name="GetSupplierView"),
    path("supplier-details/<int:supplier_id>/", GetSingleSupplierView.as_view(), name="GetSingleSupplierView"),
    path("create-supplier/<int:campaign_id>/", PostSupplierView.as_view(), name="PostSupplierView"),
    path("update-supplier/<int:supplier_id>/", PutSupplierView.as_view(), name="PutSupplierView"),
    path("delete-supplier/<int:supplier_id>/", DeleteSupplierView.as_view(), name="DeleteSupplierView"),

    # campaign urls
    path("campaigns/", GetCampaignsView.as_view(), name="GetCampaignsView"),
    path("campaign-details/<int:campaign_id>/", FetchSingleCampaignView.as_view(), name="PostCampaignView"),
    path("create-campaign/", PostCampaignView.as_view(), name="PostCampaignView"),
    path("edit-campaign/<str:campaign_id>/", PutCampaignView.as_view(), name="PutCampaignView"),
    path("delete-campaign/<int:campaign_id>/", DeleteCampaignView.as_view(), name="DeleteCampaignView"),
    
    # campaign fields urls
    path("fields/<int:campaign_id>/", GetFieldsView.as_view(), name="GetFieldView"),
    path("create-field/<int:campaign_id>/", PostFieldView.as_view(), name="PostFieldView"),
    path("fetch-field/<int:field_id>/", FetchFieldView.as_view(), name="FetchFieldView"),
    path("edit-field/<int:field_id>/", PutFieldView.as_view(), name="PutFieldView"),
    path("delete-field/<int:field_id>/", DeleteFieldsView.as_view(), name="DeleteFields"),
    
    # buyer urls
    path("buyers/<int:campaign_id>/", GetBuyersView.as_view(), name="DeleteBuyerView"),
    path("fetch-buyer/<int:buyer_id>/", FetchBuyerView.as_view(), name="FetchBuyerView"),
    path("create-buyer/", PostBuyerView.as_view(), name="DeleteBuyerView"),
    path("edit-buyer/<int:buyer_id>/", PutBuyerView.as_view(), name="DeleteBuyerView"),
    path("delete-buyer/<int:buyer_id>/", DeleteBuyerView.as_view(), name="DeleteBuyerView"),

    # timezone urls
    path("timezones/", GetTimeZoneView.as_view(), name="GetTimeZoneView"),

    # filter urls
    path("filters/<int:campaign_id>/", GetFiltersView.as_view(), name="GetFiltersView"),
    path("add-filter/", PostFilterView.as_view(), name="PostFilterView"),
    path("fetch-filter/<int:filter_id>/", FetchFilterView.as_view(), name="FetchFilterView"),
    path("update-filter/<int:filter_id>/", PutFilterView.as_view(), name="FetchFilterView"),
    path("delete-filter/<int:filter_id>/", DeleteFilterView.as_view(), name="FetchFilterView"),

    # analytics urls
    path("report/", AnalyticsView.as_view(), name="AnalyticsView"),

    # test lead
    path("all-leads/", GetAllRecentLeads.as_view(), name="GetAllRecentLeads"),
    path("test-ingest/", SendTestLeadView.as_view(), name="SendTestLeadView"),
    # delete lead
    path("delete-lead/<int:lead_id>/", DeleteLeadView.as_view(), name="DeleteLeadView"),
    path("ingest/", IngestLeadView.as_view(), name="IngestLeadView"),
    path("ingest-debt/", IngestDebtRelief.as_view(), name="IngestDebtRelief"),
    # ingest home security
    path("ingest-homesecurity/", IngestHomeSecuity.as_view(), name="IngestHomeSecuity"),
    # record urls
    path("record/", GetRecordsView.as_view(), name="GetRecordsView"),
    # test campaign
    path("test-campaign/", PostTestCampaignView.as_view(), name="PostTestCampaignView"),

    # logics url
    path("get-logics/", GetSegmentationLogicView.as_view(), name="GetSegmentationLogicView"),
    path("post-logic/", PostSegmentationLogicView.as_view(), name="PostSegmentationLogicVIew"),

    # realtime leads urls
    path("leads/", GetLeadsByCampaignView.as_view(), name="GetLeadsByCampaignView"),
    path("lead-details/<int:lead_id>/", GetLeadDetails.as_view(), name="GetLeadDetails"),
]
