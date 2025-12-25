import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useMemo, useState } from 'react';
import { IPurchasableOffer, Offer, ProductTypeEnum } from '../../../../../api';
import { Column, Flex, LayoutAvatarImageView, LayoutGridItemProps } from '../../../../../common';
import { LayoutCatalogGridItem } from '../../../../../common/layout/LayoutCatalogGridItem';
import { useCatalog, useFrameAsset, useInventoryFurni } from '../../../../../hooks';
import { CatalogPriceGridDisplayWidgetView } from '../widgets/CatalogPriceGridDisplayWidgetViev';

interface CatalogGridOfferViewProps extends LayoutGridItemProps
{
    offer: IPurchasableOffer;
    selectOffer: (offer: IPurchasableOffer) => void;
    isFrame?: boolean;
}

export const CatalogGridOfferView: FC<CatalogGridOfferViewProps> = props =>
{
    const { offer = null, selectOffer = null,isFrame = false, itemActive = false, ...rest } = props;
    const [ isMouseDown, setMouseDown ] = useState(false);
    const { requestOfferToMover = null } = useCatalog();
    const { isVisible = false } = useInventoryFurni();
    const frameCode = offer?.badgeCode || offer?.product?.extraParam || null;
    const framePreviewUrl = useFrameAsset(isFrame ? frameCode : null, 'profile');

    const iconUrl = useMemo(() =>
    {
        if(offer.pricingModel === Offer.PRICING_MODEL_BUNDLE)
        {
            return null;
        }

        return offer.product.getIconUrl(offer);
    }, [ offer ]);

    const onMouseEvent = (event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                selectOffer(offer);
                setMouseDown(true);
                return;
            case MouseEventType.MOUSE_UP:
                setMouseDown(false);
                return;
            case MouseEventType.ROLL_OUT:
                if(!isMouseDown || !itemActive || !isVisible) return;

                requestOfferToMover(offer);
                return;
        }
    }

    const product = offer.product;
    const gridItemImage = isFrame ? (framePreviewUrl || iconUrl) : iconUrl;

    if(!product) return null;
    if (isFrame) {
        return (
        <Column  className="catalog-grid-active cursor-pointer" style={{padding:"10px", width: "160px", height:"110px"}} gap={ 0 } itemActive={ itemActive } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent }>
            <LayoutCatalogGridItem itemImage={ gridItemImage } itemCount={ ((offer.pricingModel === Offer.PRICING_MODEL_MULTI) ? product.productCount : 1) } itemUniqueSoldout={ (product.uniqueLimitedItemSeriesSize && !product.uniqueLimitedItemsLeft) } itemUniqueNumber={ product.uniqueLimitedItemSeriesSize } { ...rest }>
                { (offer.product.productType === ProductTypeEnum.ROBOT) &&
                <LayoutAvatarImageView figure={ offer.product.extraParam } headOnly={ true } direction={ 3 } /> }
            </LayoutCatalogGridItem>
            <Flex justifyContent="center" fullWidth gap={ 0 } >
                <Column gap={ 0 }>
                    <CatalogPriceGridDisplayWidgetView offer={ offer } />
                </Column>
            </Flex>
        </Column>
    );
    }
    return (
        <Column className="catalog-grid-active cursor-pointer" gap={ 0 } itemActive={ itemActive } onMouseDown={ onMouseEvent } onMouseUp={ onMouseEvent } onMouseOut={ onMouseEvent }>
            <LayoutCatalogGridItem itemImage={ gridItemImage } itemCount={ ((offer.pricingModel === Offer.PRICING_MODEL_MULTI) ? product.productCount : 1) } itemUniqueSoldout={ (product.uniqueLimitedItemSeriesSize && !product.uniqueLimitedItemsLeft) } itemUniqueNumber={ product.uniqueLimitedItemSeriesSize } { ...rest }>
                { (offer.product.productType === ProductTypeEnum.ROBOT) &&
                <LayoutAvatarImageView figure={ offer.product.extraParam } headOnly={ true } direction={ 3 } style={{left:"-24px"}} /> }
            </LayoutCatalogGridItem>
            <Flex alignItems="end" justifyContent="end" fullWidth gap={ 0 } >
                <Column gap={ 0 }>
                    <CatalogPriceGridDisplayWidgetView offer={ offer } />
                </Column>
            </Flex>
        </Column>
    );
}
