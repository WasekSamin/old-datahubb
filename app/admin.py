from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register([
    Client, Supplier, Distribution, Field, Campaign, FieldType, FieldValue, Buyer, TestCampaign,
    Lead, DebtRelief, TimeZone, Record, Logic, Segmentation, HomeSecurity
])
