import { FC } from 'react';
import { ICatalogNode } from '../../../../../api';
import { Column, Flex, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogIconView } from '../../catalog-icon/CatalogIconView';

export interface CatalogHeaderViewProps
{
    node: ICatalogNode;
}

export const CatalogHeaderView: FC<CatalogHeaderViewProps> = props =>
{
    const { node = null } = props;
    const { currentPage = null, activateNode = null, rootNode = null, getNodeById = null } = useCatalog();
    
    const foundNode = (currentPage && rootNode) ? getNodeById(currentPage.pageId, rootNode) : null;

    return (
        <>
            <Flex className="catalog-header">
                <Column gap={ 0 } className="catalog-header-content">
                    { foundNode && <CatalogIconView icon={ foundNode.iconId } /> }
                    { foundNode && <Text bold className="catalog-header-title h-100">{ foundNode.localization }</Text> }
                    <Text className="catalog-header-desc" dangerouslySetInnerHTML={ { __html: currentPage && currentPage.localization.getText(0) } }/>
                </Column>
                <Flex className="catalog-header-image" style={ { backgroundImage: `url(${ currentPage && currentPage.localization.getImage(0) })` } } />
            </Flex>
        </>
    );
}
