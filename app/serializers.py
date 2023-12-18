from rest_framework import serializers
from .models import *


class DistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Distribution
        fields = "__all__"
        

class FieldValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldValue
        fields = "__all__"
        

class FieldTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldType
        fields = "__all__"
        

class FieldSerializer(serializers.ModelSerializer):
    field_values = FieldValueSerializer(many=True)
    class Meta:
        model = Field
        fields = "__all__"
        

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ["id", "created_at", "updated_at", "name", "phone_number", "company_name", "email"]
        
        
class LeadCapSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadsCapSetting
        fields = "__all__"
        

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetCapSetting
        fields = "__all__"


class TimeZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeZone
        fields = "__all__"
        

class SupplierSerializer(serializers.ModelSerializer):
    # client = ClientSerializer()
    timezone = TimeZoneSerializer()

    class Meta:
        model = Supplier
        fields = "__all__"
        

class StaticValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticValue
        fields = "__all__"
        

class StaticFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticField
        fields = "__all__"
        
    
class PostTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostType
        fields = "__all__"
        

class HeadersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Headers
        fields = "__all__"
        

class PostSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostSetting
        fields = "__all__"


class BuyerSerializerCampaign(serializers.ModelSerializer):
    class Meta:
        model = Buyer
        fields = "__all__"


class CampaignSerializer(serializers.ModelSerializer):
    distribution_type = DistributionSerializer()
    suppliers = SupplierSerializer(many=True, read_only=True)
    fields = FieldSerializer(many=True, read_only=True)
    buyers = BuyerSerializerCampaign(many=True, read_only=True)
    
    class Meta:
        model = Campaign
        fields = "__all__"


class BuyerSerializer(serializers.ModelSerializer):
    # client = ClientSerializer()
    campaign = CampaignSerializer()
    fields = FieldSerializer(many=True, read_only=True)
    timezone = TimeZoneSerializer()

    class Meta:
        model = Buyer
        fields = "__all__"


# issue
class CampaignSupplierBuyerFieldsSerializer(serializers.ModelSerializer):
    distribution_type = DistributionSerializer()
    suppliers = SupplierSerializer(many=True, read_only=True)
    buyers = BuyerSerializer(many=True, read_only=True)
    fields= FieldSerializer(many=True, read_only=True)
    
    class Meta:
        model = Campaign
        fields = "__all__"


class LeadCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = "__all__"
        
        
class LeadSerializer(serializers.ModelSerializer):
    # campaign = LeadCampaignSerializer()
    class Meta:
        model = Lead
        fields = "__all__"


class TestCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCampaign
        fields = "__all__"
        
        
class DebtReliefSerializer(serializers.ModelSerializer):
    class Meta:
        model = DebtRelief
        fields = "__all__"


class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = "__all__"


class FilterSerializer(serializers.ModelSerializer):
    campaign = CampaignSerializer()

    class Meta:
        model = Filter
        fields = "__all__"


class LogicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logic
        fields = "__all__"


class SegmentationSerializer(serializers.ModelSerializer):
    logic = LogicSerializer()
    leads = LeadSerializer(many=True, read_only=True)

    class Meta:
        model = Segmentation,
        fields = "__all__"


class HomeSecuritySerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeSecurity
        fields = "__all__"


