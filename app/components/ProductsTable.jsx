import {
  TextField,
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  IndexFiltersMode,
  useIndexResourceState,
  Text,
  ChoiceList,
  RangeSlider,
  Badge,
} from '@shopify/polaris';
import {useState, useCallback} from 'react';

function IndexFiltersWithFilteringModeExample({ items }) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const [itemStrings, setItemStrings] = useState(['All', 'Available', 'Out of Stock']);

  const deleteView = (index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

  const duplicateView = async (name) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  };

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: 'rename',
              onAction: () => {},
              onPrimaryAction: async (value) => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: 'duplicate',
              onPrimaryAction: async (value) => {
                await sleep(1);
                duplicateView(value);
                return true;
              },
            },
            {
              type: 'edit',
            },
            {
              type: 'delete',
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  }));

  const [selected, setSelected] = useState(0);

  const onCreateNewView = async (value) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };

  const sortOptions = [
    {label: 'Name', value: 'name asc', directionLabel: 'A-Z'},
    {label: 'Name', value: 'name desc', directionLabel: 'Z-A'},
    {label: 'Price', value: 'price asc', directionLabel: 'Low to High'},
    {label: 'Price', value: 'price desc', directionLabel: 'High to Low'},
  ];

  const [sortSelected, setSortSelected] = useState(['name asc']);
  const {mode, setMode} = useSetIndexFiltersMode(IndexFiltersMode.Filtering);

  const onHandleCancel = () => {};

  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };

  const primaryAction = selected === 0
    ? {
        type: 'save-as',
        onAction: onCreateNewView,
        disabled: false,
        loading: false,
      }
    : {
        type: 'save',
        onAction: onHandleSave,
        disabled: false,
        loading: false,
      };

  const [productStatus, setProductStatus] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [queryValue, setQueryValue] = useState('');

  const handleProductStatusChange = useCallback((value) => setProductStatus(value), []);
  const handlePriceRangeChange = useCallback((value) => setPriceRange(value), []);
  const handleFiltersQueryChange = useCallback((value) => setQueryValue(value), []);

  const handleProductStatusRemove = useCallback(() => setProductStatus([]), []);
  const handlePriceRangeRemove = useCallback(() => setPriceRange([0, 500]), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);

  const handleFiltersClearAll = useCallback(() => {
    handleProductStatusRemove();
    handlePriceRangeRemove();
    handleQueryValueRemove();
  }, [handleProductStatusRemove, handlePriceRangeRemove, handleQueryValueRemove]);

  const filters = [
    {
      key: 'productStatus',
      label: 'Product status',
      filter: (
        <ChoiceList
          title="Product status"
          titleHidden
          choices={[
            {label: 'Available', value: 'available'},
            {label: 'Out of Stock', value: 'out_of_stock'},
          ]}
          selected={productStatus}
          onChange={handleProductStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'priceRange',
      label: 'Price range',
      filter: (
        <RangeSlider
          label="Price range is between"
          labelHidden
          value={priceRange}
          prefix="$"
          output
          min={0}
          max={1000}
          step={1}
          onChange={handlePriceRangeChange}
        />
      ),
    },
    {
      key: 'queryValue',
      label: 'Search',
      filter: (
        <TextField
          label="Search"
          value={queryValue}
          onChange={handleFiltersQueryChange}
          autoComplete="off"
          labelHidden
        />
      ),
    },
  ];

  const appliedFilters = [];
  if (productStatus.length > 0) {
    const key = 'productStatus';
    appliedFilters.push({
      key,
      label: `Product status: ${productStatus.join(', ')}`,
      onRemove: handleProductStatusRemove,
    });
  }
  if (priceRange[0] !== 0 || priceRange[1] !== 500) {
    const key = 'priceRange';
    appliedFilters.push({
      key,
      label: `Price: $${priceRange[0]} - $${priceRange[1]}`,
      onRemove: handlePriceRangeRemove,
    });
  }
  if (queryValue) {
    const key = 'queryValue';
    appliedFilters.push({
      key,
      label: `Search for "${queryValue}"`,
      onRemove: handleQueryValueRemove,
    });
  }

  // Assuming productData is an array of products with fields: id, name, price, status
  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(items);

  const rowMarkup = items.map(({ id, title, price, status }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {title}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" numeric>
          ${price.toFixed(2)}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone={status === 'Active' ? 'success' : 'info'}>
          {status}
        </Badge>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <>
      <IndexFilters
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        queryValue={queryValue}
        queryPlaceholder="Searching in all products"
        onQueryChange={handleFiltersQueryChange}
        onQueryClear={() => setQueryValue('')}
        onSort={setSortSelected}
        primaryAction={primaryAction}
        cancelAction={{
          onAction: onHandleCancel,
          disabled: false,
          loading: false,
        }}
        tabs={tabs}
        selected={selected}
        onSelect={setSelected}
        canCreateNewView
        onCreateNewView={onCreateNewView}
        filters={filters}
        appliedFilters={appliedFilters}
        onClearAll={handleFiltersClearAll}
        mode={mode}
        setMode={setMode}
      />
      <IndexTable
        resourceName={resourceName}
        itemCount={items.length}
        selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
        onSelectionChange={handleSelectionChange}
        headings={[
          {title: 'Product'},
          {title: 'Price'},
          {title: 'Status'},
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </>
  );
}

export default IndexFiltersWithFilteringModeExample;
