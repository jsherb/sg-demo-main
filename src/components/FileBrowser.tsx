import React, { useState } from 'react';
import { Compass, Table2, BarChart3, Folder, FileText } from 'lucide-react';
import clsx from 'clsx';

export type FileType = {
  name: string;
  content: string;
  icon: React.ReactNode;
  preview?: string;
};

const files: FileType[] = [
  {
    name: 'ecomm.model',
    content: `connection: "big_query_connection"

include: "/views/**/*.view"

datagroup: big_query_connection_project_default_datagroup {
  max_cache_age: "1 hour"
}

persist_with: big_query_connection_project_default_datagroup

explore: order_items {
  label: "Order Items"
  
  join: products {
    type: left_outer
    relationship: many_to_one
    sql_on: \${order_items.product_id} = \${products.id} ;;
  }

  join: users {
    type: left_outer
    relationship: many_to_one
    sql_on: \${order_items.user_id} = \${users.id} ;;
  }
}`,
    icon: <Compass size={16} className="text-[#5f6368]" />,
    preview: 'explore: order_items {'
  },
  {
    name: 'views/order_items.view',
    content: `view: order_items {
  sql_table_name: bigquery-public-data.thelook_ecommerce.order_items ;;

  dimension: id {
    primary_key: yes
    type: number
    sql: \${TABLE}.id ;;
  }

  dimension: order_id {
    type: number
    sql: \${TABLE}.order_id ;;
  }

  dimension: user_id {
    type: number
    sql: \${TABLE}.user_id ;;
  }

  dimension: product_id {
    type: number
    sql: \${TABLE}.product_id ;;
  }

  dimension: inventory_item_id {
    type: number
    sql: \${TABLE}.inventory_item_id ;;
  }

  dimension: status {
    type: string
    sql: \${TABLE}.status ;;
  }

  dimension_group: created {
    type: time
    timeframes: [raw, date, week, month, quarter, year]
    sql: \${TABLE}.created_at ;;
  }

  dimension_group: shipped {
    type: time
    timeframes: [raw, date, week, month, quarter, year]
    sql: \${TABLE}.shipped_at ;;
  }

  dimension_group: delivered {
    type: time
    timeframes: [raw, date, week, month, quarter, year]
    sql: \${TABLE}.delivered_at ;;
  }

  dimension_group: returned {
    type: time
    timeframes: [raw, date, week, month, quarter, year]
    sql: \${TABLE}.returned_at ;;
  }

  dimension: sale_price {
    type: number
    sql: \${TABLE}.sale_price ;;
    value_format_name: usd
  }

  measure: count {
    type: count
    drill_fields: [id, user_id, product_id]
  }

  dimension: is_shipped {
    label: "Is Shipped"
    description: "Indicates if the order item has been shipped"
    type: yesno
    sql: \${status} = 'Shipped' ;;
  }

  dimension: is_delivered {
    label: "Is Delivered"
    description: "Indicates if the order item has been delivered"
    type: yesno
    sql: \${status} = 'Delivered' ;;
  }

  dimension: is_returned {
    label: "Is Returned"
    description: "Indicates if the order item has been returned"
    type: yesno
    sql: \${status} = 'Returned' ;;
  }

  dimension_group: time_to_ship {
    label: "Time to Ship"
    description: "Duration between order creation and shipment"
    type: duration
    intervals: [day, hour, minute]
    sql_start: \${created_raw} ;;
    sql_end: \${shipped_raw} ;;
  }

  dimension_group: time_to_deliver {
    label: "Time to Deliver"
    description: "Duration between order shipment and delivery"
    type: duration
    intervals: [day, hour, minute]
    sql_start: \${shipped_raw} ;;
    sql_end: \${delivered_raw} ;;
  }

  measure: average_sale_price {
    label: "Average Sale Price"
    description: "Average sale price of the order items"
    type: average
    sql: \${sale_price} ;;
    value_format_name: usd
  }

  measure: total_sale_price {
    label: "Total Sale Price"
    description: "Total sale price of the order items"
    type: sum
    sql: \${sale_price} ;;
    value_format_name: usd
  }
}`,
    icon: <FileText size={16} className="text-[#5f6368]" />,
    preview: 'view: order_items {'
  },
  {
    name: 'views/products.view',
    content: `view: products {
  sql_table_name: bigquery-public-data.thelook_ecommerce.products ;;

  dimension: id {
    primary_key: yes
    type: number
    sql: \${TABLE}.id ;;
  }

  dimension: cost {
    type: number
    sql: \${TABLE}.cost ;;
    value_format_name: usd
  }

  dimension: category {
    type: string
    sql: \${TABLE}.category ;;
  }

  dimension: name {
    type: string
    sql: \${TABLE}.name ;;
  }

  dimension: brand {
    type: string
    sql: \${TABLE}.brand ;;
  }

  dimension: retail_price {
    type: number
    sql: \${TABLE}.retail_price ;;
    value_format_name: usd
  }

  dimension: department {
    type: string
    sql: \${TABLE}.department ;;
  }

  dimension: sku {
    type: string
    sql: \${TABLE}.sku ;;
  }

  dimension: distribution_center_id {
    type: number
    sql: \${TABLE}.distribution_center_id ;;
  }

  dimension: profit {
    label: "Profit"
    description: "Calculated profit based on retail price minus cost."
    type: number
    sql: \${retail_price} - \${cost} ;;
    value_format_name: usd
  }

  measure: count {
    type: count
    drill_fields: [id, name, category]
  }

  measure: average_retail_price {
    label: "Average Retail Price"
    description: "Average retail price of products."
    type: average
    sql: \${retail_price} ;;
    value_format_name: usd
  }

  measure: total_retail_price {
    label: "Total Retail Price"
    description: "Total retail price of products."
    type: sum
    sql: \${retail_price} ;;
    value_format_name: usd
  }

  measure: average_cost {
    label: "Average Cost"
    description: "Average cost of products."
    type: average
    sql: \${cost} ;;
    value_format_name: usd
  }

  measure: total_cost {
    label: "Total Cost"
    description: "Total cost of products."
    type: sum
    sql: \${cost} ;;
    value_format_name: usd
  }

  measure: average_profit {
    label: "Average Profit"
    description: "Average profit per product."
    type: average
    sql: \${profit} ;;
    value_format_name: usd
  }

  measure: total_profit {
    label: "Total Profit"
    description: "Total profit from all products."
    type: sum
    sql: \${profit} ;;
    value_format_name: usd
  }

  dimension: retail_price_tier {
    label: "Retail Price Tier"
    description: "Tiered grouping of retail prices."
    type: tier
    tiers: [0, 25, 50, 75, 100, 200, 500]
    style: integer
    sql: \${retail_price} ;;
  }

  dimension: cost_tier {
    label: "Cost Tier"
    description: "Tiered grouping of product costs."
    type: tier
    tiers: [0, 10, 20, 30, 40, 50]
    style: integer
    sql: \${cost} ;;
  }

  dimension: profit_tier {
    label: "Profit Tier"
    description: "Tiered grouping of product profits."
    type: tier
    tiers: [-10, 0, 10, 20, 30, 40, 50, 100]
    style: integer
    sql: \${profit} ;;
  }
}`,
    icon: <FileText size={16} className="text-[#5f6368]" />,
    preview: 'view: products {'
  },
  {
    name: 'views/users.view',
    content: `view: users {
  sql_table_name: bigquery-public-data.thelook_ecommerce.users ;;

  dimension: id {
    primary_key: yes
    type: number
    sql: \${TABLE}.id ;;
  }

  dimension: first_name {
    type: string
    sql: \${TABLE}.first_name ;;
  }

  dimension: last_name {
    type: string
    sql: \${TABLE}.last_name ;;
  }

  dimension: email {
    type: string
    sql: \${TABLE}.email ;;
  }

  dimension: age {
    type: number
    sql: \${TABLE}.age ;;
  }

  dimension: gender {
    type: string
    sql: \${TABLE}.gender ;;
  }

  dimension: state {
    type: string
    sql: \${TABLE}.state ;;
  }

  dimension: street_address {
    type: string
    sql: \${TABLE}.street_address ;;
  }

  dimension: postal_code {
    type: string
    sql: \${TABLE}.postal_code ;;
  }

  dimension: city {
    type: string
    sql: \${TABLE}.city ;;
  }

  dimension: country {
    type: string
    sql: \${TABLE}.country ;;
  }

  dimension_group: location {
    type: location
    sql_latitude: \${TABLE}.latitude ;;
    sql_longitude: \${TABLE}.longitude ;;
  }

  dimension: traffic_source {
    type: string
    sql: \${TABLE}.traffic_source ;;
  }

  dimension_group: created {
    type: time
    timeframes: [raw, date, week, month, quarter, year]
    sql: \${TABLE}.created_at ;;
  }

  dimension: user_geom {
    type: string
    sql: \${TABLE}.user_geom ;;
  }

  measure: count {
    type: count
    drill_fields: [id, first_name, last_name]
  }

  dimension: age_tier {
    label: "Age Tier"
    description: "Tiering of user ages for analysis."
    type: tier
    tiers: [0, 18, 25, 35, 50, 65, 100]
    style: integer
    sql: \${age} ;;
  }

  dimension: full_name {
    label: "Full Name"
    description: "Concatenation of first and last names."
    type: string
    sql: CONCAT(\${first_name}, " ", \${last_name}) ;;
  }

  dimension: is_male {
    label: "Is Male"
    description: "Flag indicating if the user's gender is male."
    type: yesno
    sql: \${gender} = 'Male' ;;
  }

  dimension: is_female {
    label: "Is Female"
    description: "Flag indicating if the user's gender is female."
    type: yesno
    sql: \${gender} = 'Female' ;;
  }

  measure: average_age {
    label: "Average Age"
    description: "Average age of users."
    type: average
    sql: \${age} ;;
  }
}`,
    icon: <FileText size={16} className="text-[#5f6368]" />,
    preview: 'view: users {'
  },
  {
    name: 'dashboards/ecommerce.dashboard',
    content: `dashboard: ecommerce {
  title: "E-commerce Analytics"
  
  tile: order_trends {
    title: "Order Trends"
    model: ecomm.model
    explore: order_items
    type: looker_line
    fields: [
      order_items.created_date,
      order_items.count
    ]
    sorts: [order_items.created_date desc]
    limit: 500
  }
}`,
    icon: <BarChart3 size={16} className="text-[#5f6368]" />,
    preview: 'dashboard: ecommerce {'
  },
  {
    name: 'README.md',
    content: `# Acme E-commerce Analytics

This LookML project provides analytics for our e-commerce platform.

## Models
- \`ecomm.model\`: Main model for order analytics

## Views
- \`order_items\`: Order line items
- \`products\`: Product catalog
- \`users\`: Customer information

## Dashboards
- \`ecommerce\`: Main e-commerce analytics dashboard`,
    icon: <FileText size={16} className="text-[#5f6368]" />,
    preview: '# Acme E-commerce Analytics'
  }
];

interface FileBrowserProps {
  onFileSelect: (file: FileType) => void;
  selectedFile?: string;
}

export const FileBrowser: React.FC<FileBrowserProps> = ({ onFileSelect, selectedFile }) => {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['views', 'dashboards']);

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev =>
      prev.includes(folder)
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    );
  };

  const groupedFiles = files.reduce((acc, file) => {
    const parts = file.name.split('/');
    if (parts.length === 1) {
      acc.root.push(file);
    } else {
      const folder = parts[0];
      if (!acc[folder]) {
        acc[folder] = [];
      }
      acc[folder].push({
        ...file,
        name: parts[1]
      });
    }
    return acc;
  }, { root: [] } as Record<string, FileType[]>);

  return (
    <div className="w-[240px] border-r border-[#dadce0] bg-white">
      <div className="h-12 flex items-center text-[13px] font-medium px-4 border-b border-[#dadce0]">
        File Browser
      </div>
      <div className="p-2 h-[calc(100vh-157px)] overflow-y-auto">
        {/* Root files */}
        {groupedFiles.root.map(file => (
          <button
            key={file.name}
            className={clsx(
              "flex items-center gap-2 w-full text-left p-1.5 rounded",
              selectedFile === file.name ? 'bg-[#e8f0fe] text-[#202124]' : 'text-[#5f6368] hover:bg-[#f1f3f4]'
            )}
            onClick={() => onFileSelect(file)}
          >
            {file.icon}
            <span className="text-[13px]">{file.name}</span>
          </button>
        ))}

        {/* Views folder */}
        <div className="mt-2">
          <button
            className="flex items-center gap-1 w-full text-left p-1.5 text-[#5f6368] hover:bg-[#f1f3f4] rounded"
            onClick={() => toggleFolder('views')}
          >
            <span className="w-4 text-[18px] leading-none">{expandedFolders.includes('views') ? '▾' : '▸'}</span>
            <Folder size={16} />
            <span className="text-[13px]">views</span>
          </button>
          {expandedFolders.includes('views') && (
            <div className="ml-6">
              {groupedFiles.views?.map(file => (
                <button
                  key={file.name}
                  className={clsx(
                    "flex items-center gap-2 w-full text-left p-1.5 rounded",
                    selectedFile === `views/${file.name}` ? 'bg-[#e8f0fe] text-[#202124]' : 'text-[#5f6368] hover:bg-[#f1f3f4]'
                  )}
                  onClick={() => onFileSelect(files.find(f => f.name === `views/${file.name}`)!)}
                >
                  {file.icon}
                  <span className="text-[13px]">{file.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dashboards folder */}
        <div className="mt-2">
          <button
            className="flex items-center gap-1 w-full text-left p-1.5 text-[#5f6368] hover:bg-[#f1f3f4] rounded"
            onClick={() => toggleFolder('dashboards')}
          >
            <span className="w-4 text-[18px] leading-none">{expandedFolders.includes('dashboards') ? '▾' : '▸'}</span>
            <Folder size={16} />
            <span className="text-[13px]">dashboards</span>
          </button>
          {expandedFolders.includes('dashboards') && (
            <div className="ml-6">
              {groupedFiles.dashboards?.map(file => (
                <button
                  key={file.name}
                  className={clsx(
                    "flex items-center gap-2 w-full text-left p-1.5 rounded",
                    selectedFile === `dashboards/${file.name}` ? 'bg-[#e8f0fe] text-[#202124]' : 'text-[#5f6368] hover:bg-[#f1f3f4]'
                  )}
                  onClick={() => onFileSelect(files.find(f => f.name === `dashboards/${file.name}`)!)}
                >
                  {file.icon}
                  <span className="text-[13px]">{file.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};