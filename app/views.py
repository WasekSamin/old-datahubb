import json
from django.http import JsonResponse
from rest_framework.response import Response as response
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework import status
from app.custom_exception import IdNotFound
from django.db.models import Subquery, OuterRef, Max
from rest_framework.pagination import PageNumberPagination
import requests
from rest_framework.generics import ListAPIView
from django.db.models import Q, Count
from datetime import datetime
from django.utils.dateformat import DateFormat
from .helpers import FindAndGetStatus


# supplier api functions
class GetSupplierView(APIView):
    pagination_class = PageNumberPagination

    def get(self, request, campaign_id):
        try:
            queryset = Supplier.objects.filter(
                campaign=campaign_id
            )
            serializer_class = SupplierSerializer(queryset, many=True)
            total = len(queryset)
            return response({
                "success": True,
                "total": total,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetSingleSupplierView(APIView):
    def get(self, request, supplier_id):
        try:
            supplierId = get_object_or_404(
                Supplier, id=supplier_id
            )
            serializer_class = SupplierSerializer(supplierId)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

class PostSupplierView(APIView):
    def post(self, request, campaign_id):
        try:
            # if
            supplier = Supplier.objects.create(
                # client=Client.objects.get(id=request.data.get("client_id")),
                campaign=Campaign.objects.get(id=campaign_id),
                # public_name=request.data.get("public_name"),
                supplier_name=request.data.get("supplier_name"),
                timezone=TimeZone.objects.get(
                    id=request.data.get("timezone")
                ),
                lead_volume_daily_cap=request.data.get("lead_volume_daily_cap"),
                lead_volume_weekly_cap=request.data.get("lead_volume_weekly_cap"),
                lead_volume_monthly_cap=request.data.get("lead_volume_monthly_cap"),
                budget_daily_cap=request.data.get("budget_daily_cap"),
                budget_weekly_cap=request.data.get("budget_weekly_cap"),
                budget_monthly_cap=request.data.get("budget_monthly_cap"),
                price=request.data.get("price"),
                source=request.data.get("source")
            )
            
            serializer_class = SupplierSerializer(supplier)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PutSupplierView(APIView):
    def put(self, request, supplier_id):
        try:
            supplier = get_object_or_404(
                Supplier,
                id=supplier_id
            )
            # supplier.client = get_object_or_404(
            #     Client,
            #     id=request.data.get("client_id")
            # )
            supplier.campaign = get_object_or_404(
                Campaign,
                id=request.data.get("campaign_id")
            )
            supplier.timezone = get_object_or_404(
                TimeZone,
                id=request.data.get("timezone")
            )
            # supplier.public_name = request.data.get("public_name")
            supplier.supplier_name = request.data.get("supplier_name")
            supplier.lead_volume_daily_cap = request.data.get("lead_volume_daily_cap")
            supplier.lead_volume_weekly_cap = request.data.get("lead_volume_weekly_cap")
            
            supplier.budget_daily_cap = request.data.get("budget_daily_cap")
            supplier.budget_weekly_cap = request.data.get("budget_weekly_cap")
            supplier.budget_monthly_cap = request.data.get("budget_monthly_cap")
            
            supplier.price = request.data.get("price")
            supplier.source = request.data.get("source")
            
            supplier.save()
            serializer_class = SupplierSerializer(supplier)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeleteSupplierView(APIView):
    def delete(self, request, supplier_id):
        try:
            query_object = Supplier.objects.get(
                id=supplier_id
            )
            query_object.delete()
            serializer_class = SupplierSerializer(query_object)
            return response({
                "success": True,
                "message": "Supplier has been removed!"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetCampaignsView(APIView):
    def get(self, request):
        try:
            campaigns = Campaign.objects.all()
            serializer_class = CampaignSerializer(campaigns, many=True)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

class PostCampaignView(APIView):
    def post(self, request):
        try:
            if not request.data.get("distribution_type"):
                campaign = Campaign.objects.create(
                    campaign_title=request.data.get("campaign_title"),
                )
            else:
                campaign = Campaign.objects.create(
                    campaign_title=request.data.get("campaign_title"),
                    distribution_type=Distribution.objects.get(
                        id=request.data.get("distribution_type")
                    ),
                )
            serializer_class = CampaignSerializer(campaign)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

class FetchSingleCampaignView(APIView):
    def get(self, request, campaign_id):
        try:
            query_object = get_object_or_404(
                Campaign, id=campaign_id
            )
            serializer_class = CampaignSupplierBuyerFieldsSerializer(query_object)
            return response({
                "success": True,
                "data": serializer_class.data,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

class PutCampaignView(APIView):
    def put(self, request, campaign_id):
        try:
            campaign = get_object_or_404(
                Campaign, id=campaign_id
            )
            # print(request.data)
            is_active_ping = request.data.get("is_active_ping")
            ping_fields = request.data.get("ping_fields")

            campaign.ping_fields.clear()
            
            if not request.data.get("distribution_type"):
                campaign.campaign_title = request.data.get("campaign_title")
                campaign.is_active = request.data.get("is_active")
                
                # saving ping fields
                # on test

                if is_active_ping:
                    ping_fields = request.data.get("ping_fields")
                    for pf in ping_fields:
                        field_id = pf.get("value")

                        if field_id:
                            ping_field_object = Field.objects.get(
                                id=field_id
                            )
                            campaign.ping_fields.add(ping_field_object)
                campaign.is_active_ping = is_active_ping
                campaign.save()
            else:
                campaign.campaign_title = request.data.get("campaign_title")
                campaign.is_active = request.data.get("is_active")
                campaign.is_active_ping = is_active_ping
                if is_active_ping:
                    ping_fields = request.data.get("ping_fields")
                    for pf in ping_fields:
                        field_id = pf.get("value")

                        if field_id:
                            ping_field_object = Field.objects.get(
                                id=field_id
                            )
                            campaign.ping_fields.add(ping_field_object)
                campaign.save()
            serializer_class = CampaignSerializer(campaign)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

class DeleteCampaignView(APIView):
    def delete(self, request, campaign_id):
        try:
            campaign = get_object_or_404(
                Campaign, id=campaign_id
            )
            campaign.delete()
            return response({
                "success": True,
                "message": "Campaign Removed!"
            }, status=status.HTTP_200_OK)
        except Exception as E:
            return response({
                "success": False,
                "message": str(E)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def getDistribution(request):
    queryset = Distribution.objects.all()
    serializer_class = DistributionSerializer(queryset, many=True)
    return response({
        "data": serializer_class.data,
        "status": status.HTTP_200_OK
    })


class GetFieldType(APIView):
    def get(self, request):
        try:
            queryset = FieldType.objects.all()
            serializer_class = FieldTypeSerializer(queryset, many=True)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PostFieldType(APIView):
    def post(self, request):
        try:
            field_type = FieldType.objects.create(
                type_name=request.data.get("type_name"),
                field_format=request.data.get("field_format")
            )
            serializer_class = FieldTypeSerializer(field_type)
            return response({
                "success": True,
                "message": "Posted!",
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetFieldsView(APIView):
    def get(self, request, campaign_id):
        try:
            campaign__id = get_object_or_404(
                Campaign, id=campaign_id
            )
            fields = get_list_or_404(
                Field, campaign=campaign__id.id
            )
            serializer_class = FieldSerializer(fields, many=True)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PostFieldView(APIView):
    def post(self, request, campaign_id):
        try:
            campaign__id = get_object_or_404(Campaign, id=campaign_id)
            data = request.data
            
            field = Field.objects.create(
                field_name=data["field_name"],
                field_type=data["field_type"],
                post_status=data["post_status"],
                field_visiblity=data["field_visiblity"],
                campaign=get_object_or_404(Campaign, id=campaign__id.id)
            )
            convert_to_lower_field_type = field.field_type.lower()
            if convert_to_lower_field_type == "list":
                field_values = request.data.get("value_title")
                for f in field_values:
                    print(f)
                    field__values = FieldValue.objects.create(value_title=f)
                    field.field_values.add(field__values)
            field.save()
            serializer_class = FieldSerializer(field)
            return response({
                "status": status.HTTP_201_CREATED,
                "data": serializer_class.data
            })
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

class FetchFieldView(APIView):
    def get(self, request, field_id):
        try:
            field = get_object_or_404(
                Field, id=field_id
            )
            serializer_class = FieldSerializer(field)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

class PutFieldView(APIView):
    def put(self, request, field_id):
        try:
            field__id = get_object_or_404(
                Field, id=field_id
            )
            field__id.field_name = request.data.get("field_name")
            field__id.field_type = request.data.get("field_type")
            field__id.post_status = request.data.get("post_status")
            field__id.field_visiblity = request.data.get("field_visiblity")
            
            if request.data.get("field_type") == "list":
                field_values = request.data.get("value_title")
                for f in field_values:
                    print(f)
                    field__values = FieldValue.objects.create(value_title=f)
                    field__id.field_values.add(field__values)
            
            field__id.save()
            serializer_class = FieldSerializer(field__id)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeleteFieldsView(APIView):
    def delete(self, request, field_id):
        try:
            query_object = get_object_or_404(
                Field, id=field_id
            )
            query_object.delete()
            return response({
                "success": True,
                "message": "Removed!"
            })
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

class GetBuyersView(APIView):
    def get(self, request, campaign_id):
        try:
            buyers = get_list_or_404(
                Buyer, campaign=campaign_id
            )
            serializer_class = BuyerSerializer(buyers, many=True)
            return response({
                "success": True,
                "data": serializer_class.data
            })
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PostBuyerView(APIView):
    def post(self, request):
        try:
            buyer = Buyer.objects.create(
                # client=get_object_or_404(Client, id=request.data.get("client_id")),
                buyer_name=request.data.get("buyer_name"),
                campaign=get_object_or_404(Campaign, id=request.data.get("campaign_id")),
                lead_volume_daily_cap=request.data.get("lead_volume_daily_cap"),
                lead_volume_weekly_cap=request.data.get("lead_volume_weekly_cap"),
                lead_volume_monthly_cap=request.data.get("lead_volume_monthly_cap"),
                budget_daily_cap=request.data.get("budget_daily_cap"),
                budget_weekly_cap=request.data.get("budget_weekly_cap"),
                budget_monthly_cap=request.data.get("budget_monthly_cap"),
                delivery_method=request.data.get("delivery_method"),
                post_url=request.data.get("post_url"),
                ping_url=request.data.get("ping_url"),
                request_method=request.data.get("request_method"),
                payload_type=request.data.get("payload_type"),
                body=request.data.get("body"),
                response_type=request.data.get("response_type"),
                price=request.data.get("price"),
                timezone=get_object_or_404(
                    TimeZone, id=request.data.get("timezone")
                ),

                accepted_condition=request.data.get("accepted_condition"),
                accepted_condition_key=request.data.get("accepted_condition_key"),
                accepted_condition_value=request.data.get("accepted_condition_value"),
                
                duplicate_condition=request.data.get('duplicate_condition'),
                duplicate_condition_key=request.data.get("duplicate_condition_key"),
                duplicate_condition_value=request.data.get("duplicate_condition_value")
            )
            headers = request.data.get("headers")
            for header in headers:
                header_key = header.get("header_key")
                header_value = header.get("header_value")
                head = Headers.objects.create(
                    header_key=header_key, header_value=header_value
                )
                buyer.headers.add(head)
            buyer.save()
            serializer_class = BuyerSerializer(buyer)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
class FetchBuyerView(APIView):
    def get(self, request, buyer_id):
        try:
            buyer = get_object_or_404(Buyer, id=buyer_id)
            # fields = get_list_or_404(Field, campaign=buyer.campaign.id)
            serializer_class = BuyerSerializer(buyer)
            return response({
                "success": True,
                # "fields": [fields],
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
class PutBuyerView(APIView):
    def put(self, request, buyer_id):
        try:
            buyer = get_object_or_404(Buyer, id=buyer_id)
            # buyer.client = get_object_or_404(Client, id=request.data.get("client_id"))
            buyer.buyer_name = request.data.get("buyer_name")
            buyer.campaign = get_object_or_404(Campaign, id=buyer.campaign.id)
            buyer.lead_volume_daily_cap = request.data.get("lead_volume_daily_cap")
            buyer.lead_volume_weekly_cap = request.data.get("lead_volume_weekly_cap")
            buyer.lead_volume_monthly_cap = request.data.get("lead_volume_monthly_cap")
            buyer.budget_daily_cap = request.data.get("budget_daily_cap")
            buyer.budget_weekly_cap = request.data.get("budget_weekly_cap")
            buyer.budget_monthly_cap = request.data.get("budget_monthly_cap")
            buyer.delivery_method = request.data.get("delivery_method")
            buyer.post_url = request.data.get("post_url")
            buyer.ping_url = request.data.get("ping_url")
            buyer.request_method = request.data.get("request_method")
            buyer.payload_type = request.data.get("payload_type")
            buyer.body = request.data.get("body")
            buyer.response_type = request.data.get("response_type")
            buyer.price = request.data.get("price")
            buyer.timezone = get_object_or_404(
                TimeZone, id=request.data.get("timezone")
            )
                
            buyer.accepted_condition = request.data.get("accepted_condition")
            buyer.accepted_condition_key = request.data.get("accepted_condition_key")
            buyer.accepted_condition_value = request.data.get("accepted_condition_value")
            
            buyer.duplicate_condition = request.data.get('duplicate_condition')
            buyer.duplicate_condition_key = request.data.get("duplicate_condition_key")
            buyer.duplicate_condition_value = request.data.get("duplicate_condition_value")
            
            buyer.save()
            serializer_class = BuyerSerializer(buyer)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
class DeleteBuyerView(APIView):
    def delete(self, request, buyer_id):
        try:
            buyer = get_object_or_404(Buyer, id=buyer_id)
            buyer.delete()
            serializer_class = BuyerSerializer(buyer)
            return response({
                "success": True,
                "message": "Buyer removed!"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SendTestLeadView(APIView):
    def post(self, request):
        try:
            headers = {
                'Content-Type': 'application/json',  # Set the content type as JSON
                # 'Other-Header': 'value'  # Add other headers if needed
            }
            lead = Lead.objects.create(
                campaign=Campaign.objects.get(
                    id=request.data.get("campaign_id")
                ),
                payload=request.data.get("payload"),
                is_test=True
            )
            # valid_payload = lead.payload.replace("'", "\"")
            buyers = Buyer.objects.filter(
                campaign=lead.campaign.id

            ).first()
            supplier = Supplier.objects.filter(
                campaign=lead.campaign.id
            ).first()

            # saving source inside lead
            lead.supplier_source = supplier.source
            lead.save()

            # for buyer in buyers:
            #     print(buyer.id)
            # print(buyers.post_url)
            if lead.campaign.is_active_ping is True:
                if buyers.ping_url:
                    ping = requests.post(buyers.ping_url, buyers.ping_body)
                    ping_data = json.loads(ping.text)
                    ping_response = ping_data.get("success")
                    ping_unique_resp = ping_data.get("message")
                    lead.ping_response_log = ping.text
                    lead.save()
                    # recording suppliers total requests
                    supplier.total_request_sent += 1
                    supplier.save()

                    if ping_response is not None:
                        if not ping_response:
                            lead.ping_status = "REJECTED"
                        else:
                            lead.ping_status = "ACCEPTED"
                        if "UNIQUE constraint failed" in ping_unique_resp:
                            lead.ping_status = "DUPLICATED"
                    lead.save()
                    if lead.ping_status != "REJECTED" and lead.ping_status != "DUPLICATED":
                        send = requests.post(buyers.post_url, lead.payload)
                        get_success_data = json.loads(send.text)
                        resp = get_success_data.get("success")
                        unique_resp = get_success_data.get("message")
                        lead.response_log = send.text
                        lead.save()
                        serializer_class = LeadSerializer(lead)
                        # return response
                        # if lead.is_test:
                        return response({
                            "test": True,
                            "success": True,
                            "ping_response": ping_response,
                            "payload": lead.payload,
                            "response": resp,
                            "data": serializer_class.data
                        }, status=status.HTTP_200_OK)
                        # post status code

            else:
                # print("ping deactivated")
                send = requests.post(buyers.post_url, json=lead.payload, headers=headers)
                # dynamic status mapping code
                # calling helper class
                status_map = FindAndGetStatus()
                # calling helper functions
                final_response = status_map.find_and_get_status(
                    json.dumps(send.json()), buyers.accepted_condition, buyers.accepted_condition_key,
                    buyers.accepted_condition_value
                )
                print("Response => " + json.dumps(send.json()))
                print(final_response)
                lead.status = final_response
                lead.response_log = send.text
                lead.save()

                record = Record.objects.first()
                if final_response == "ACCEPTED":
                    record.total_accepted += 1
                    lead.campaign.total_accepted += 1
                    buyers.total_accepted += 1
                    buyers.save()
                    lead.campaign.save()
                    record.save()

                elif final_response == "REJECTED":
                    record.total_rejected += 1
                    lead.campaign.total_rejected += 1
                    buyers.total_rejected += 1
                    buyers.save()
                    lead.campaign.save()
                    record.save()
                
                else:
                    record.total_duplicated += 1
                    lead.campaign.total_duplicated += 1
                    buyers.total_duplicated += 1
                    buyers.save()
                    lead.campaign.save()
                    record.save()

                # saving campaign
                lead.campaign.total_posted = lead.campaign.total_accepted + lead.campaign.total_rejected + lead.campaign.total_duplicated

                lead.campaign.save()
                # saving buyers
                buyers.total_sell = buyers.total_rejected + buyers.total_accepted + buyers.total_duplicated
                buyers.save()
                # saving record
                record.total_ingested = record.total_rejected + record.total_duplicated + record.total_accepted
                record.save()

                # recording suppliers total requests
                supplier.total_request_sent += 1
                supplier.save()

                serializer_class = LeadSerializer(lead)

                return response({
                    "test": True,
                    "success": True,
                    "payload": lead.payload,
                    "response": send.json(),
                    "data": serializer_class.data
                }, status=status.HTTP_200_OK)

        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

class IngestLeadView(APIView):
    def post(self, request):
        try:
            headers = {
                'Content-Type': 'application/json',  # Set the content type as JSON
                # 'Other-Header': 'value'  # Add other headers if needed
            }
            lead = Lead.objects.create(
                campaign=Campaign.objects.get(
                    id=request.data.get("campaign_id")
                ),
                payload=request.data.get("payload"),
                is_test=True
            )
            # valid_payload = lead.payload.replace("'", "\"")
            buyers = Buyer.objects.filter(
                campaign=lead.campaign.id

            ).first()
            supplier = Supplier.objects.filter(
                campaign=lead.campaign.id
            ).first()

            # saving source inside lead
            lead.supplier_source = supplier.source
            lead.save()

            # for buyer in buyers:
            #     print(buyer.id)
            # print(buyers.post_url)
            if lead.campaign.is_active_ping is True:
                if buyers.ping_url:
                    ping = requests.post(buyers.ping_url, buyers.ping_body)
                    ping_data = json.loads(ping.text)
                    ping_response = ping_data.get("success")
                    ping_unique_resp = ping_data.get("message")
                    lead.ping_response_log = ping.text
                    lead.save()
                    # recording suppliers total requests
                    supplier.total_request_sent += 1
                    supplier.save()

                    if ping_response is not None:
                        if not ping_response:
                            lead.ping_status = "REJECTED"
                        else:
                            lead.ping_status = "ACCEPTED"
                        if "UNIQUE constraint failed" in ping_unique_resp:
                            lead.ping_status = "DUPLICATED"
                    lead.save()
                    if lead.ping_status != "REJECTED" and lead.ping_status != "DUPLICATED":
                        send = requests.post(buyers.post_url, lead.payload)
                        get_success_data = json.loads(send.text)
                        resp = get_success_data.get("success")
                        unique_resp = get_success_data.get("message")
                        lead.response_log = send.text
                        lead.save()
                        serializer_class = LeadSerializer(lead)
                        # return response
                        # if lead.is_test:
                        return response({
                            "test": True,
                            "success": True,
                            "ping_response": ping_response,
                            "payload": lead.payload,
                            "response": resp,
                            "data": serializer_class.data
                        }, status=status.HTTP_200_OK)
                        # post status code

            else:
                # print("ping deactivated")
                send = requests.post(buyers.post_url, json=lead.payload, headers=headers)
                # dynamic status mapping code
                # calling helper class
                status_map = FindAndGetStatus()
                # calling helper functions
                final_response = status_map.find_and_get_status(
                    json.dumps(send.json()), buyers.accepted_condition, buyers.accepted_condition_key,
                    buyers.accepted_condition_value
                )
                print(final_response)
                lead.status = final_response
                lead.response_log = send.text
                lead.save()

                record = Record.objects.first()
                if final_response == "ACCEPTED":
                    record.total_accepted += 1
                    lead.campaign.total_accepted += 1
                    buyers.total_accepted += 1
                    buyers.save()
                    lead.campaign.save()
                    record.save()

                elif final_response == "REJECTED":
                    record.total_rejected += 1
                    lead.campaign.total_rejected += 1
                    buyers.total_rejected += 1
                    buyers.save()
                    lead.campaign.save()
                    record.save()

                else:
                    record.total_duplicated += 1
                    lead.campaign.total_duplicated += 1
                    buyers.total_duplicated += 1
                    buyers.save()
                    lead.campaign.save()
                    record.save()

                # saving campaign
                lead.campaign.total_posted = lead.campaign.total_accepted + lead.campaign.total_rejected + lead.campaign.total_duplicated

                lead.campaign.save()
                # saving buyers
                buyers.total_sell = buyers.total_rejected + buyers.total_accepted + buyers.total_duplicated
                buyers.save()
                # saving record
                record.total_ingested = record.total_rejected + record.total_duplicated + record.total_accepted
                record.save()

                # recording suppliers total requests
                supplier.total_request_sent += 1
                supplier.save()

                serializer_class = LeadSerializer(lead)

                return response({
                    "test": False,
                    "success": True,
                    "payload": lead.payload,
                    "response": send.json(),
                    "data": serializer_class.data
                }, status=status.HTTP_200_OK)

        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeleteLeadView(APIView):
    def delete(self, request, lead_id):
        try:
            query_object = get_object_or_404(
                Lead, id=lead_id
            )
            if query_object is not None:
                query_object.delete()

            serializer_class = LeadSerializer(query_object)
            return response({
                "success": True,
                "message": "Lead removed!"
            }, 200)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, 500)


class PostTestCampaignView(APIView):
    def post(self, request):
        try:
            test = TestCampaign.objects.create(
                firstName=request.data.get("firstName"),
                lastName=request.data.get("lastName"),
                email=request.data.get("email"),
                phone=request.data.get("phone")
            )
            serializer_class = TestCampaignSerializer(test)
            return response({
                "success": True,
                "message": "Lead Created",
                "data": serializer_class.data
            })
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class GetClientsView(APIView):
    def get(self, request):
        try:
            queryset = Client.objects.all()
            serializer_class = ClientSerializer(queryset, many=True)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class FetchClientDetailsView(APIView):
    def get(self, request, client_id):
        try:
            if client_id is not None:
                clientId = get_object_or_404(Client, id=client_id)
                serializer_class = ClientSerializer(clientId)
                return response({
                    "success": True,
                    "data": serializer_class.data
                }, status=status.HTTP_200_OK)
            else:
                raise IdNotFound(client_id)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class PostClientView(APIView):
    def post(self, request):
        data = request.data
        client = Client(
            name=data["name"],
            email=data["email"],
            phone_number=data["phone_number"],
            company_name=data["company_name"]
        )
        client.save()
        serializer_class = ClientSerializer(client)
        return response({
            "status": status.HTTP_201_CREATED,
            "data": serializer_class.data
        })
    

@api_view(["PUT"])
def clientPutView(request, client_id):
    try:
        data = request.data
        client = get_object_or_404(Client, id=client_id)
        client.name = data["name"]
        client.phone_numer = data["phone_number"]
        client.email = data["email"]
        client.company_name = data["company_name"]
        client.save()
        serializer_class = ClientSerializer(client)
        return response({
            "status": status.HTTP_200_OK,
            "data": serializer_class.data
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return response({
            "success": False,
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
def clientDeleteView(request, client_id):
    if client_id is not None:
        client = get_object_or_404(Client, id=client_id)
        client.delete()
        serializer_class = ClientSerializer(client)
        return response({
            "status": status.HTTP_201_CREATED,
            "data": serializer_class.data
        })
    else:
        return response({
            "success": 503,
            "message": "Client Id Not Found!"
        })


class GetTimeZoneView(APIView):
    def get(self, request):
        try:
            queryset = TimeZone.objects.all()
            serializer_class = TimeZoneSerializer(queryset, many=True)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except TimeZone.DoesNotExist as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetAllRecentLeads(ListAPIView):
    serializer_class = LeadSerializer
    pagination_class = PageNumberPagination
    pagination_class.page_size = 5

    def get_queryset(self):
        try:
            queryset = Lead.objects.all().order_by("-created_at")
            # serializer_class = LeadSerializer(queryset, many=True)
            return queryset
            # return response({
            #     "success": True,
            #     "data": [queryset]
            # }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetLeadsByCampaignView(APIView):

    def post(self, request):
        try:
            campaign_id = request.data.get("campaign_id")
            queryset = Lead.objects.filter(
                campaign=campaign_id
            ).order_by("-id")
            len_of_res = len(queryset)

            # filter by status
            lead_status = request.data.get("status")
            # getting source
            source = request.data.get("source")
            # getting buyer
            buyer = request.data.get("buyer")
            # getting supplier
            supplier = request.data.get("supplier")

            if lead_status:
                queryset = Lead.objects.filter(
                    Q(campaign=campaign_id) & Q(status=lead_status)
                )
                # print(queryset)
            # filter by date
            lead_date = request.data.get("lead_date")
            if lead_date:
                queryset = Lead.objects.filter(
                    Q(campaign=campaign_id) & Q(created_at=lead_date)
                )
                # queryset = Lead.objects.filter(campaign=campaign_id).filter(created_at=lead_date)
                # print(queryset)
            if source:
                queryset = Lead.objects.filter(
                    Q(campaign=campaign_id) & Q(supplier_source=source)
                )

            # filter by buyer
            if buyer:
                queryset = Lead.objects.filter(
                    Q(campaign=campaign_id) & Q(campaign__buyers__id=buyer)
                )

            # filter by supplier
            if supplier:
                queryset = Lead.objects.filter(
                    Q(campaign=campaign_id) & Q(campaign__suppliers__id=supplier)
                )

            # if all presents
            if campaign_id and lead_status and lead_date and source and buyer and supplier:
                queryset = Lead.objects.filter(
                    Q(campaign=campaign_id) & Q(status=lead_status) & Q(created_at=lead_date)
                    & Q(supplier_source=source) & Q(campaign__buyers__id=buyer) & Q(campaign__suppliers__id=supplier)
                )
                # print("All => " + str(queryset))

            serializer_class = LeadSerializer(queryset, many=True)
            return response({
                "success": True,
                "length": len_of_res,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetLeadDetails(APIView):
    def get(self, request, lead_id):
        try:
            query = get_object_or_404(
                Lead, id=lead_id
            )
            serializer_class = LeadSerializer(query)
            return response({
                "success": True,
                "message": "200 Ok",
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetRecordsView(APIView):
    def get(self, request):
        try:
            record = Record.objects.first()
            serializer_class = RecordSerializer(record)
            return response({
                "status": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# filter views
class GetFiltersView(APIView):
    def get(self, request, campaign_id):
        try:
            queryset = get_list_or_404(
                Filter, campaign=campaign_id
            )
            serializer_class = FilterSerializer(queryset, many=True)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FetchFilterView(APIView):
    def get(self, request, filter_id):
        try:
            query_object = get_object_or_404(
                Filter, id=filter_id
            )
            serializer_class = FilterSerializer(query_object)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PostFilterView(APIView):
    def post(self, request):
        try:
            filter_object = Filter.objects.create(
                campaign=Campaign.objects.get(id=request.data.get("campaign")),
                filter_type=request.data.get("filter_type"),
                key=request.data.get("key"),
                conditions=request.data.get("conditions"),
                value=request.data.get("value"),
                result=request.data.get("result")
            )
            serializer_class = FilterSerializer(filter_object)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
               "success": False,
               "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PutFilterView(APIView):
    def put(self, request, filter_id):
        try:
            filter_object = get_object_or_404(
                Filter, id=filter_id
            )
            filter_object.campaign = Campaign.objects.get(
                id=request.data.get("campaign")
            )
            filter_object.filter_type = request.data.get("filter_type")
            filter_object.key = request.data.get("key")
            filter_object.conditions = request.data.get("condition")
            filter_object.value = request.data.get("value")
            filter_object.result = request.data.get("result")

            filter_object.save()
            serializer_class = FilterSerializer(filter_object)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
               "success": False,
               "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeleteFilterView(APIView):
    def delete(self, request, filter_id):
        try:
            filter_object = get_object_or_404(
                Filter, id=filter_id
            )
            filter_object.delete()
            serializer_class = FilterSerializer(filter_object)
            return response({
                "success": True,
                "message": "Filter removed!"
            })
        except Exception as e:
            return response({
               "success": False,
               "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AnalyticsView(APIView):
    def post(self, request):
        try:
            campaign_id = request.data.get("campaign_id")
            to_date = request.data.get("to_date")
            from_date = request.data.get("from_date")

            campaign = Campaign.objects.get(
                id=campaign_id
            )
            campaign_serializer_class = CampaignSerializer(campaign)
            supplier = Supplier.objects.filter(
                campaign=campaign_id
            ).first()
            supplier_serializer_class = SupplierSerializer(supplier)
            buyer = Buyer.objects.filter(
                campaign=campaign_id
            ).first()
            buyer_serializer_class = BuyerSerializer(buyer)

            leads = Lead.objects.filter(
                Q(campaign=campaign_id) & Q(created_at__lte=from_date) | Q(created_at__gte=to_date)
            )

            # counting accepted leads
            accepted_leads = Lead.objects.filter(
                Q(status="ACCEPTED") & Q(campaign=campaign_id) & Q(created_at__lte=from_date)
                | Q(created_at__gte=to_date)
            ).count()

            total_accepted = accepted_leads
            # print(total_accepted)
            # counting rejected leads
            rejected_leads = Lead.objects.filter(
                Q(status="REJECTED") & Q(campaign=campaign_id) & Q(created_at__lte=from_date) |
                Q(created_at__gte=to_date)
            ).count()
            total_rejected = rejected_leads
            # print(total_rejected)
            # counting duplicated leads
            duplicated_lead = Lead.objects.filter(
                Q(status="DUPLICATED") & Q(campaign=campaign_id) & Q(created_at__lte=from_date) |
                Q(created_at__gte=to_date)
            ).count()
            total_duplicated = duplicated_lead

            total_request = leads.count()

            # calculating sells and profits

            supplier_turn_over = total_accepted * supplier.price
            # calculating profit
            cost = supplier.total_request_sent * supplier.price

            if cost > supplier_turn_over:
                profit = cost - supplier_turn_over
            else:
                profit = supplier_turn_over - cost

            if supplier_turn_over > total_request * supplier.price:
                supplier_margin = ((supplier_turn_over - total_request * supplier.price) / supplier_turn_over) * 100
            else:
                supplier_margin = ((total_request * supplier.price - supplier_turn_over) / supplier_turn_over) * 100
            # print(round(supplier_margin, 2))

            # calculating accept/rejected ratio
            if buyer.total_rejected != 0:
                accept_rejected_ratio = buyer.total_accepted / buyer.total_rejected
            else:
                accept_rejected_ratio = 0
            # print(accept_rejected_ratio)

            supplier_avg_sell = supplier_turn_over / total_accepted
            # buyer sells and profits
            buyer_total_sell = buyer.total_accepted * buyer.price

            serializer_class = LeadSerializer(leads, many=True)

            return response({
                "success": True,
                "turn_over": supplier_turn_over,
                "profit": profit,
                "margin": round(supplier_margin, 2),
                "accept_reject_ration": accept_rejected_ratio,
                "supplier_avg_sell": supplier_avg_sell,
                "buyer_total_sell": buyer_total_sell,
                "posted": total_request,
                "total_accepted": total_accepted,
                "total_rejected": total_rejected,
                "total_duplicated": total_duplicated,
                "supplier": supplier_serializer_class.data,
                "buyer": buyer_serializer_class.data,
                "campaign": campaign_serializer_class.data,
                "data": serializer_class.data
            }, 200)

        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetSegmentationLogicView(APIView):
    def get(self, request):
        try:
            queryset = Logic.objects.all()
            serializer_class = LogicSerializer(queryset, many=True)
            return response({
                "success": True,
                "data": serializer_class.data
            }, 200)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, 500)


class PostSegmentationLogicView(APIView):
    def post(self, request):
        try:
            logic = Logic.objects.create(
                logic_key=request.data.get("logic_key"),
                operator=request.data.get("operator"),
                logic_value=request.data.get("logic_value")
            )
            serializer_class = LogicSerializer(logic)
            return response({
                "success": True,
                "message": "Logic has been added!",
                "data": serializer_class.data
            }, 201)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, 500)


class FetchSingleSegmentationLogic(APIView):
    def get(self, request, slug):
        try:
            query_object = get_object_or_404(
                Logic, slug=slug
            )
            serializer_class = LogicSerializer(query_object)
            return response({
                "success": True,
                "data": serializer_class.data
            }, 200)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, 500)


class PutSegmentationLogicView(APIView):
    def put(self, request, logic_id):
        try:
            logic = get_object_or_404(
                Logic, id=logic_id
            )
            logic.logic_key = request.data.get("logic_key")
            logic.operator = request.data.get("operator")
            logic.logic_value = request.data.get("logic_value")

            logic.save()

            serializer_class = LogicSerializer(logic)
            return response({
                "success": True,
                "message": "Logic has been updated!",
                "data": serializer_class.data
            }, 200)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, 500)


class DeleteSegmentationLogicView(APIView):
    def delete(self, request, logic_id):
        try:
            logic = get_object_or_404(
                Logic, id=logic_id
            )
            if logic is not None:
                logic.delete()

            return response({
                "success": True,
                "message": "Logic has been removed"
            })
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, 500)


class GetSegmentionView(APIView):
    def post(self, request):
        try:
            pass
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, 500)


class FetchSingleSegmentionView(APIView):
    def post(self, request):
        try:
            pass
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, 500)


class PostSegmentionView(APIView):
    def post(self, request):
        try:
            pass
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, 500)


class PutSegmentionView(APIView):
    def post(self, request):
        try:
            pass
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, 500)


class DeleteSegmentionView(APIView):
    def post(self, request):
        try:
            pass
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, 500)


# custom campaigns 
# debt relief endpoint
class IngestDebtRelief(APIView):
    def post(self, request):
        try:
            debt = DebtRelief.objects.create(
                debt_amount=request.data.get("debt_amount"),
                firstName=request.data.get("firstName"),
                lastName=request.data.get("lastName"),
                email=request.data.get("email"),
                phone=request.data.get("phone"),
                state=request.data.get("state")
            )
            serializer_class = DebtReliefSerializer(debt)
            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class IngestHomeSecuity(APIView):
    def post(self, request):
        try:
            homesecurity = HomeSecurity.objects.create(
                property_type=request.data.get("property_type"),
                property_size=request.data.get("property_size"),
                many_doors=request.data.get("many_doors"),
                first_name=request.data.get("first_name"),
                last_name=request.data.get('last_name'),
                phone=request.data.get("phone"),
                email=request.data.get("email")
            )

            serializer_class = HomeSecuritySerializer(homesecurity)

            return response({
                "success": True,
                "data": serializer_class.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

