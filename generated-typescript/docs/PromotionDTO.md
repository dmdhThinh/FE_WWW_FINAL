# PromotionDTO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [default to undefined]
**code** | **string** |  | [default to undefined]
**discountType** | **string** |  | [default to undefined]
**discountValue** | **number** |  | [default to undefined]
**startDate** | **string** |  | [default to undefined]
**endDate** | **string** |  | [default to undefined]
**isActive** | **boolean** |  | [default to undefined]
**details** | [**Array&lt;PromotionDetailDTO&gt;**](PromotionDetailDTO.md) |  | [optional] [default to undefined]

## Example

```typescript
import { PromotionDTO } from './api';

const instance: PromotionDTO = {
    id,
    name,
    code,
    discountType,
    discountValue,
    startDate,
    endDate,
    isActive,
    details,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
