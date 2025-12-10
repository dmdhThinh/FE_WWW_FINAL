# CartControllerApi

All URIs are relative to *http://localhost:8080/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addToCart**](#addtocart) | **POST** /cart/add | |
|[**checkout**](#checkout) | **POST** /cart/checkout | |
|[**clearCart**](#clearcart) | **DELETE** /cart/clear | |
|[**getCartItem**](#getcartitem) | **GET** /cart/item | |
|[**getCartItemCount**](#getcartitemcount) | **GET** /cart/count | |
|[**getCartItems**](#getcartitems) | **GET** /cart/items | |
|[**getCartTotal**](#getcarttotal) | **GET** /cart/total | |
|[**isCartEmpty**](#iscartempty) | **GET** /cart/empty | |
|[**removeFromCart**](#removefromcart) | **DELETE** /cart/remove | |
|[**updateCartItem**](#updatecartitem) | **PATCH** /cart/update | |

# **addToCart**
> object addToCart(requestBody)


### Example

```typescript
import {
    CartControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartControllerApi(configuration);

let requestBody: { [key: string]: any; }; //

const { status, data } = await apiInstance.addToCart(
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **{ [key: string]: any; }**|  | |


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

# **checkout**
> object checkout(requestBody)


### Example

```typescript
import {
    CartControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartControllerApi(configuration);

let requestBody: { [key: string]: any; }; //

const { status, data } = await apiInstance.checkout(
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **{ [key: string]: any; }**|  | |


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

# **clearCart**
> object clearCart()


### Example

```typescript
import {
    CartControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartControllerApi(configuration);

const { status, data } = await apiInstance.clearCart();
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

# **getCartItem**
> Array<CartItemDTO> getCartItem()


### Example

```typescript
import {
    CartControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartControllerApi(configuration);

const { status, data } = await apiInstance.getCartItem();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<CartItemDTO>**

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

# **getCartItemCount**
> { [key: string]: number; } getCartItemCount()


### Example

```typescript
import {
    CartControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartControllerApi(configuration);

const { status, data } = await apiInstance.getCartItemCount();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**{ [key: string]: number; }**

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

# **getCartItems**
> Array<CartItemDTO> getCartItems()


### Example

```typescript
import {
    CartControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartControllerApi(configuration);

const { status, data } = await apiInstance.getCartItems();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<CartItemDTO>**

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

# **getCartTotal**
> { [key: string]: number; } getCartTotal()


### Example

```typescript
import {
    CartControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartControllerApi(configuration);

const { status, data } = await apiInstance.getCartTotal();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**{ [key: string]: number; }**

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

# **isCartEmpty**
> { [key: string]: boolean; } isCartEmpty()


### Example

```typescript
import {
    CartControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartControllerApi(configuration);

const { status, data } = await apiInstance.isCartEmpty();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**{ [key: string]: boolean; }**

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

# **removeFromCart**
> object removeFromCart(requestBody)


### Example

```typescript
import {
    CartControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartControllerApi(configuration);

let requestBody: { [key: string]: any; }; //

const { status, data } = await apiInstance.removeFromCart(
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **{ [key: string]: any; }**|  | |


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

# **updateCartItem**
> object updateCartItem(requestBody)


### Example

```typescript
import {
    CartControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CartControllerApi(configuration);

let requestBody: { [key: string]: any; }; //

const { status, data } = await apiInstance.updateCartItem(
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **{ [key: string]: any; }**|  | |


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

