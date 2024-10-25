import { ResourceList, ResourceItem, Text } from '@shopify/polaris';
import { useState } from 'react';

function ResourceItemExample({ items }) { // Accept items as a prop
  const [selectedItems, setSelectedItems] = useState([])

  return (
    <>
      <ResourceList
        resourceName={{ singular: 'item', plural: 'items' }}
        items={items}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        selectable
        renderItem={(item) => {
          const { id, url, title, author } = item;
          const authorMarkup = author ? <div>by {author}</div> : null;
          return (
            <ResourceItem
              id={id}
              url={url}
              accessibilityLabel={`View details for ${title}`}
              name={title}
            >
              <Text variant="bodyMd" fontWeight="bold" as="h3">
                {title}
              </Text>
              {authorMarkup}
            </ResourceItem>
          );
        }}
      />
    </>
  );
}

export default ResourceItemExample;
