# CategoryControllerApi

All URIs are relative to *http://localhost:8080/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createCategory**](#createcategory) | **POST** /admin/categories | |
|[**deleteCategory**](#deletecategory) | **DELETE** /admin/categories/{id} | |
|[**getAllCategories**](#getallcategories) | **GET** /categories | |
|[**getCategoryById**](#getcategorybyid) | **GET** /categories/{id} | |
|[**searchByName**](#searchbyname) | **GET** /categories/search | |
|[**updateCategory**](#updatecategory) | **PUT** /admin/categories/{id} | |

# **createCategory**
> object createCategory(categoryDTO)


### Example

```typescript
import {
    CategoryControllerApi,
    Configuration,
    CategoryDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryControllerApi(configuration);

let categoryDTO: CategoryDTO; //

const { status, data } = await apiInstance.createCategory(
    categoryDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **categoryDTO** | **CategoryDTO**|  | |


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

# **deleteCategory**
> object deleteCategory()


### Example

```typescript
import {
    CategoryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteCategory(
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

# **getAllCategories**
> object getAllCategories()


### Example

```typescript
import {
    CategoryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryControllerApi(configuration);

let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getAllCategories(
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 10|


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

# **getCategoryById**
> object getCategoryById()


### Example

```typescript
import {
    CategoryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getCategoryById(
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

# **searchByName**
> object searchByName()


### Example

```typescript
import {
    CategoryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryControllerApi(configuration);

let name: string; // (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.searchByName(
    name,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] |  | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 10|


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

# **updateCategory**
> object updateCategory(categoryDTO)


### Example

```typescript
import {
    CategoryControllerApi,
    Configuration,
    CategoryDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryControllerApi(configuration);

let id: number; // (default to undefined)
let categoryDTO: CategoryDTO; //

const { status, data } = await apiInstance.updateCategory(
    id,
    categoryDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **categoryDTO** | **CategoryDTO**|  | |
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

