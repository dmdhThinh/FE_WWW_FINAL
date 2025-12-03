# PromotionControllerApi

All URIs are relative to *http://localhost:8080/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**_delete**](#_delete) | **DELETE** /admin/promotions/{id} | |
|[**assignProducts**](#assignproducts) | **POST** /admin/promotions/{id}/assign-products | |
|[**create**](#create) | **POST** /admin/promotions | |
|[**getAll**](#getall) | **GET** /admin/promotions | |
|[**getById**](#getbyid) | **GET** /admin/promotions/{id} | |
|[**update**](#update) | **PUT** /admin/promotions/{id} | |

# **_delete**
> object _delete()


### Example

```typescript
import {
    PromotionControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromotionControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance._delete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **assignProducts**
> object assignProducts(requestBody)


### Example

```typescript
import {
    PromotionControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromotionControllerApi(configuration);

let id: number; // (default to undefined)
let requestBody: Array<number>; //

const { status, data } = await apiInstance.assignProducts(
    id,
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **Array<number>**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **create**
> object create(promotionDTO)


### Example

```typescript
import {
    PromotionControllerApi,
    Configuration,
    PromotionDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new PromotionControllerApi(configuration);

let promotionDTO: PromotionDTO; //

const { status, data } = await apiInstance.create(
    promotionDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promotionDTO** | **PromotionDTO**|  | |


### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAll**
> object getAll()


### Example

```typescript
import {
    PromotionControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromotionControllerApi(configuration);

const { status, data } = await apiInstance.getAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getById**
> object getById()


### Example

```typescript
import {
    PromotionControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromotionControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update**
> object update(promotionDTO)


### Example

```typescript
import {
    PromotionControllerApi,
    Configuration,
    PromotionDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new PromotionControllerApi(configuration);

let id: number; // (default to undefined)
let promotionDTO: PromotionDTO; //

const { status, data } = await apiInstance.update(
    id,
    promotionDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promotionDTO** | **PromotionDTO**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

