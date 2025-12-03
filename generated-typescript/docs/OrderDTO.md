# OrderDTO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**userId** | **number** |  | [optional] [default to undefined]
**orderCode** | **string** |  | [optional] [default to undefined]
**discountAmount** | **number** |  | [optional] [default to undefined]
**finalAmount** | **number** |  | [optional] [default to undefined]
**paymentMethod** | **string** |  | [optional] [default to undefined]
**paymentStatus** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**shippingAddress** | **string** |  | [optional] [default to undefined]
**note** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**items** | [**Array&lt;OrderItemDTO&gt;**](OrderItemDTO.md) |  | [optional] [default to undefined]

## Example

```typescript
import { OrderDTO } from './api';

const instance: OrderDTO = {
    id,
    userId,
    orderCode,
    discountAmount,
    finalAmount,
    paymentMethod,
    paymentStatus,
    status,
    shippingAddress,
    note,
    createdAt,
    items,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
