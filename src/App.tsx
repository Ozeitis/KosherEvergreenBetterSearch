import { Hit as AlgoliaHit } from "instantsearch.js";
import algoliasearch from "algoliasearch/lite";
import React from "react";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import {
  InstantSearch,
  Breadcrumb,
  Configure,
  ClearRefinements,
  CurrentRefinements,
  DynamicWidgets,
  HierarchicalMenu,
  Highlight,
  Hits,
  HitsPerPage,
  InfiniteHits,
  Menu,
  Pagination,
  RangeInput,
  RefinementList,
  PoweredBy,
  SearchBox,
  SortBy,
  ToggleRefinement
} from "react-instantsearch-hooks-web";

import {
  Panel,
  QueryRuleContext,
  QueryRuleCustomData,
  Refresh
} from "./components";
import { Tab, Tabs } from "./components/layout";

import "./App.css";
import PlayerZero from "@goplayerzero/sdk-web";
import OpenReplay from '@openreplay/tracker';
import trackerAssist from '@openreplay/tracker-assist';
const tracker = new OpenReplay({
  projectKey: 'Co6G0IYWvgNhu96Xd7OM',
});
tracker.start();
tracker.use(trackerAssist());
PlayerZero.init('63e6b0195382e44d2d8033ee');

const searchClient = instantMeiliSearch(
  "https://ms-db879112b9bb-1931.sfo.meilisearch.io",
  "2aacf3ca459ea8a1672469d709b5ae00114bff89"
);

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    price: number;
  }>;
};

function Hit({ hit }: HitProps) {
  return (
    <>
      <Highlight hit={hit} attribute="localName" className="Hit-label" />
      <span className="Hit-price">${hit.branch.regularPrice}</span>
    </>
  );
}

export function App() {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="all_products"
      routing={true}
    >
      <Configure ruleContexts={[]} />

      <div className="Container">
        <div>
          <DynamicWidgets>
            <Panel header="Brands">
              <RefinementList
                attribute="brand"
                searchable={true}
                searchablePlaceholder="Search brands"
                showMore={true}
              />
            </Panel>
            <Panel header="Categories">
              <Menu attribute="categories" showMore={true} />
            </Panel>
            <Panel header="Hierarchy">
              <HierarchicalMenu
                attributes={[
                  "hierarchicalCategories.lvl0",
                  "hierarchicalCategories.lvl1",
                  "hierarchicalCategories.lvl2"
                ]}
                showMore={true}
              />
            </Panel>
            <Panel header="Price">
              <RangeInput attribute="hit.branch.regularPrice" />
            </Panel>
            <Panel header="Free Shipping">
              <ToggleRefinement
                attribute="free_shipping"
                label="Free shipping"
              />
            </Panel>
          </DynamicWidgets>
        </div>
        <div className="Search">
          <Breadcrumb
            attributes={[
              "hierarchicalCategories.lvl0",
              "hierarchicalCategories.lvl1",
              "hierarchicalCategories.lvl2"
            ]}
          />

          <SearchBox placeholder="Search" autoFocus />

          <QueryRuleCustomData>
            {({ items }) => (
              <>
                {items.map((item) => (
                  <a href={item.link} key={item.banner}>
                    <img src={item.banner} alt={item.title} />
                  </a>
                ))}
              </>
            )}
          </QueryRuleCustomData>

          <Tabs>
            <Tab title="Hits">
              <Hits hitComponent={Hit} />
              <Pagination className="Pagination" />
            </Tab>
            <Tab title="InfiniteHits">
              <InfiniteHits showPrevious hitComponent={Hit} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </InstantSearch>
  );
}
