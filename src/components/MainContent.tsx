import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, ThumbsUp, ThumbsDown, Edit, Send, Database, Maximize2, ChevronLeft, Table2, Plus, Sparkles, FileDown, Clipboard, FileText, Paperclip, Code2, ArrowUpLeft } from 'lucide-react';
import { FileBrowser, type FileType } from './FileBrowser';
import clsx from 'clsx';
import { GEMINI_LOGO } from '../base64/images';
// Add Looker Extension SDK imports
import { ExtensionContext, ExtensionContextData } from '@looker/extension-sdk-react';

const steps = [
  { id: 1, title: 'Data Selection' },
  { id: 2, title: 'Table Selection' },
  { id: 3, title: 'Additional Context' },
  { id: 4, title: 'Generated LookML' }
];

const CodeEditor: React.FC<{ file: FileType }> = ({ file }) => {
  // Trim any leading empty lines from the file content
  const lines = file.content.split('\n');
  
  const renderLine = (line: string) => {
    // Handle empty lines
    if (!line.trim()) return <div>&nbsp;</div>;

    // Handle comments
    if (line.trim().startsWith('#')) {
      return <div className="text-[#5f6368]">{line}</div>;
    }

    // Calculate indentation
    const indentMatch = line.match(/^(\s+)/);
    const indent = indentMatch ? indentMatch[0] : '';
    const trimmedLine = line.trim();

    // Process line with colons (property definitions)
    const colonMatch = trimmedLine.match(/^([^:]+):(.*)/);
    if (colonMatch) {
      const [_, beforeColon, afterColon] = colonMatch;
      
      // Process the part after the colon
      let processedAfterColon = afterColon;
      
      // Handle strings in double quotes
      const stringRegex = /"([^"]*)"/g;
      let stringMatch;
      let parts = [];
      let lastIndex = 0;
      
      while ((stringMatch = stringRegex.exec(processedAfterColon)) !== null) {
        // Add text before the match
        if (stringMatch.index > lastIndex) {
          parts.push(processedAfterColon.substring(lastIndex, stringMatch.index));
        }
        
        // Add the string match with red color
        parts.push(<span key={`str-${stringMatch.index}`} className="text-[#c5221f]">{stringMatch[0]}</span>);
        
        lastIndex = stringMatch.index + stringMatch[0].length;
      }
      
      // Add any remaining text
      if (lastIndex < processedAfterColon.length) {
        parts.push(processedAfterColon.substring(lastIndex));
      }
      
      // If no string matches were found, just use the original text
      if (parts.length === 0) {
        parts = [processedAfterColon];
      }
      
      // Process ${} references in each non-string part
      const processedParts = parts.map((part, i) => {
        if (typeof part === 'string') {
          const refRegex = /(\$\{[^}]+\})/g;
          let refMatch;
          let refParts = [];
          let refLastIndex = 0;
          
          while ((refMatch = refRegex.exec(part)) !== null) {
            // Add text before the match
            if (refMatch.index > refLastIndex) {
              refParts.push(part.substring(refLastIndex, refMatch.index));
            }
            
            // Add the reference match with blue color
            refParts.push(<span key={`ref-${refMatch.index}`} className="text-[#1967d2]">{refMatch[0]}</span>);
            
            refLastIndex = refMatch.index + refMatch[0].length;
          }
          
          // Add any remaining text
          if (refLastIndex < part.length) {
            refParts.push(part.substring(refLastIndex));
          }
          
          // If no reference matches were found, just use the original text
          if (refParts.length === 0) {
            return part;
          }
          
          return <React.Fragment key={`frag-${i}`}>{refParts}</React.Fragment>;
        }
        
        return part;
      });
      
      return (
        <div>
          {indent}<span className="text-[#1967d2]">{beforeColon}</span>:{processedParts}
        </div>
      );
    }

    // Handle lines with brackets, braces, etc.
    if (trimmedLine === '{' || trimmedLine === '}' || trimmedLine === ';;') {
      return <div>{indent}{trimmedLine}</div>;
    }

    // Default rendering for non-special lines
    return <div>{indent}{trimmedLine}</div>;
  };

  return (
    <div className="flex-1 bg-white overflow-hidden">
      <div className="h-12 flex items-center px-4 text-[13px] text-black font-['Noto_Sans'] border-b border-[#dadce0]">
        {file.name}
      </div>
      <div className="flex h-[calc(100vh-157px)] overflow-hidden p-0 m-0">
        {/* Line numbers */}
        <div className="w-[48px] flex-shrink-0 flex flex-col text-[#80868b] text-right pr-2 select-none border-r border-[#dadce0] bg-[#f8f9fa] m-0 p-0 overflow-hidden">
          {lines.map((_, i) => (
            <div key={i} className="h-[22px] leading-[22px] m-0 p-0">{i + 1}</div>
          ))}
        </div>
        {/* Code content */}
        <div className="flex-1 font-mono text-[13px] pl-2 text-[#202124] whitespace-pre m-0 p-0 overflow-auto">
          {lines.map((line, i) => (
            <div key={i} className="h-[22px] leading-[22px] m-0 p-0">
              {renderLine(line)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Compact version of CodeEditor for file snippets
const FileSnippet: React.FC<{ file: FileType, title: string }> = ({ file, title }) => {
  // Trim any leading empty lines from the file content
  const lines = file.content.split('\n');
  
  const renderLine = (line: string) => {
    // Handle empty lines
    if (!line.trim()) return <div>&nbsp;</div>;

    // Handle comments
    if (line.trim().startsWith('#')) {
      return <div className="text-[#5f6368]">{line}</div>;
    }

    // Calculate indentation
    const indentMatch = line.match(/^(\s+)/);
    const indent = indentMatch ? indentMatch[0] : '';
    const trimmedLine = line.trim();

    // Process line with colons (property definitions)
    const colonMatch = trimmedLine.match(/^([^:]+):(.*)/);
    if (colonMatch) {
      const [_, beforeColon, afterColon] = colonMatch;
      
      // Process the part after the colon
      let processedAfterColon = afterColon;
      
      // Handle strings in double quotes
      const stringRegex = /"([^"]*)"/g;
      let stringMatch;
      let parts = [];
      let lastIndex = 0;
      
      while ((stringMatch = stringRegex.exec(processedAfterColon)) !== null) {
        // Add text before the match
        if (stringMatch.index > lastIndex) {
          parts.push(processedAfterColon.substring(lastIndex, stringMatch.index));
        }
        
        // Add the string match with red color
        parts.push(<span key={`str-${stringMatch.index}`} className="text-[#c5221f]">{stringMatch[0]}</span>);
        
        lastIndex = stringMatch.index + stringMatch[0].length;
      }
      
      // Add any remaining text
      if (lastIndex < processedAfterColon.length) {
        parts.push(processedAfterColon.substring(lastIndex));
      }
      
      // If no string matches were found, just use the original text
      if (parts.length === 0) {
        parts = [processedAfterColon];
      }
      
      // Process ${} references in each non-string part
      const processedParts = parts.map((part, i) => {
        if (typeof part === 'string') {
          const refRegex = /(\$\{[^}]+\})/g;
          let refMatch;
          let refParts = [];
          let refLastIndex = 0;
          
          while ((refMatch = refRegex.exec(part)) !== null) {
            // Add text before the match
            if (refMatch.index > refLastIndex) {
              refParts.push(part.substring(refLastIndex, refMatch.index));
            }
            
            // Add the reference match with blue color
            refParts.push(<span key={`ref-${refMatch.index}`} className="text-[#1967d2]">{refMatch[0]}</span>);
            
            refLastIndex = refMatch.index + refMatch[0].length;
          }
          
          // Add any remaining text
          if (refLastIndex < part.length) {
            refParts.push(part.substring(refLastIndex));
          }
          
          // If no reference matches were found, just use the original text
          if (refParts.length === 0) {
            return part;
          }
          
          return <React.Fragment key={`frag-${i}`}>{refParts}</React.Fragment>;
        }
        
        return part;
      });
      
      return (
        <div>
          {indent}<span className="text-[#1967d2]">{beforeColon}</span>:{processedParts}
        </div>
      );
    }

    // Handle lines with brackets, braces, etc.
    if (trimmedLine === '{' || trimmedLine === '}' || trimmedLine === ';;') {
      return <div>{indent}{trimmedLine}</div>;
    }

    // Default rendering for non-special lines
    return <div>{indent}{trimmedLine}</div>;
  };

  return (
    <div className="bg-white rounded-lg border border-[#dadce0] overflow-hidden mb-4">
      <div className="p-3 bg-[#f8fbff] border-b border-[#dadce0]">
        <p className="text-[14px] text-[#202124]">{title}</p>
      </div>
      <div className="p-3 border-b border-[#dadce0]">
        <div className="text-[13px] text-black font-['Noto_Sans'] mb-2">{file.name}</div>
        <div className="flex h-[200px] overflow-hidden p-0 m-0 border border-[#dadce0] rounded">
          {/* Line numbers */}
          <div className="w-[48px] flex-shrink-0 flex flex-col text-[#80868b] text-right pr-2 select-none border-r border-[#dadce0] bg-[#f8f9fa] m-0 p-0 overflow-hidden">
            {lines.map((_, i) => (
              <div key={i} className="h-[22px] leading-[22px] m-0 p-0">{i + 1}</div>
            ))}
          </div>
          {/* Code content */}
          <div className="flex-1 font-mono text-[13px] pl-2 text-[#202124] whitespace-pre m-0 p-0 overflow-auto">
            {lines.map((line, i) => (
              <div key={i} className="h-[22px] leading-[22px] m-0 p-0">
                {renderLine(line)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MainContent = () => {
  // Add Extension SDK context
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTables, setSelectedTables] = useState(['order_items', 'products', 'users']);
  const [userInput, setUserInput] = useState("Enter information about your use cases and desired analysis.");
  const [showSourceUpload, setShowSourceUpload] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [addedSources, setAddedSources] = useState([
    { name: 'tableau_dashboard.png', date: '2025-01-20' },
    { name: 'user_cohorts.sql', date: '2025-01-20' }
  ]);
  const [showFileSnippets, setShowFileSnippets] = useState(false);
  // Add connection error state
  const [connectionError, setConnectionError] = useState(false);

  // Add effect to initialize and maintain connection with Looker
  useEffect(() => {
    // Check if we're in a Looker extension environment
    if (extensionContext) {
      console.log('Extension SDK initialized successfully');
      
      // Set up a heartbeat to keep the connection alive
      const heartbeatInterval = setInterval(() => {
        try {
          // Ping the Looker host to keep the connection alive
          extensionContext.extensionSDK.verifyHostConnection()
            .then(() => {
              // Connection is good, reset any error state
              if (connectionError) {
                setConnectionError(false);
              }
            })
            .catch((error) => {
              console.error('Extension connection error:', error);
              setConnectionError(true);
            });
        } catch (error) {
          console.error('Extension connection error:', error);
          setConnectionError(true);
        }
      }, 10000); // Send heartbeat every 10 seconds
      
      // Set up a global error handler for React Router errors
      const originalError = console.error;
      console.error = (...args) => {
        // Check if this is a React Router error
        const errorString = args.join(' ');
        if (errorString.includes('useHistory') || errorString.includes('react-router')) {
          console.log('Suppressing React Router error:', errorString);
          // Don't propagate React Router errors to prevent crashing
          return;
        }
        
        // For all other errors, use the original console.error
        originalError.apply(console, args);
      };
      
      return () => {
        clearInterval(heartbeatInterval);
        // Restore original console.error
        console.error = originalError;
      };
    } else {
      console.log('Not running in a Looker extension environment');
    }
  }, [extensionContext, connectionError]);

  const handleFileSelect = (file: FileType) => {
    setSelectedFile(file);
    setShowCodeEditor(true);
  };

  // Set default file when clicking "Insert All"
  useEffect(() => {
    if (showCodeEditor && !selectedFile) {
      const modelFile = {
        name: 'ecomm.model',
        content: `connection: "big_query_connection"

include: "/views/**/*.view"

datagroup: big_query_connection_project_default_datagroup {
  # sql_trigger: SELECT MAX(id) FROM etl_log;;
  max_cache_age: "1 hour"
}

persist_with: big_query_connection_project_default_datagroup

explore: order_items {
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
        icon: <FileText size={16} className="text-[#5f6368]" />,
        preview: 'explore: order_items {'
      };
      setSelectedFile(modelFile);
    }
  }, [showCodeEditor, selectedFile]);

  // Files for snippets
  const modelFile = {
    name: 'ecomm.model',
    content: `connection: "big_query_connection"

include: "/views/**/*.view"

datagroup: big_query_connection_project_default_datagroup {
  # sql_trigger: SELECT MAX(id) FROM etl_log;;
  max_cache_age: "1 hour"
}

persist_with: big_query_connection_project_default_datagroup

explore: order_items {
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
    icon: <FileText size={16} className="text-[#5f6368]" />,
    preview: 'explore: order_items {'
  };

  const orderItemsFile = {
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

  measure: count {
    type: count
    drill_fields: [id, user_id, product_id]
  }
}`,
    icon: <FileText size={16} className="text-[#5f6368]" />,
    preview: 'view: order_items {'
  };

  const productsFile = {
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

  measure: count {
    type: count
    drill_fields: [id, name, category]
  }
}`,
    icon: <FileText size={16} className="text-[#5f6368]" />,
    preview: 'view: products {'
  };

  const usersFile = {
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

  measure: count {
    type: count
    drill_fields: [id, first_name, last_name]
  }
}`,
    icon: <FileText size={16} className="text-[#5f6368]" />,
    preview: 'view: users {'
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      if (currentStep === 1 || currentStep === 3) {
        setIsLoading(true);
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          setIsLoading(false);
        }, 2000);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (showSourceUpload) {
      setShowSourceUpload(false);
      // Don't change the current step when going back from source upload
      return;
    }
    
    if (showFileSnippets) {
      setShowFileSnippets(false);
      return;
    }
    
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleTable = (table: string) => {
    setSelectedTables(prev => 
      prev.includes(table) 
        ? prev.filter(t => t !== table)
        : [...prev, table]
    );
  };

  const removeSource = (sourceName: string) => {
    setAddedSources(prev => prev.filter(source => source.name !== sourceName));
  };

  const LoadingState = () => (
    <div className="loading-container">
      <div className="loading-bar"></div>
      <div className="loading-bar"></div>
      <div className="loading-bar"></div>
    </div>
  );

  // Add connection error component
  const ConnectionErrorMessage = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">Connection Error</h3>
      <p className="text-gray-600 mb-6">
        Unable to connect to the Looker extension host. This could be due to:
      </p>
      <ul className="text-left text-gray-600 mb-6">
        <li className="mb-2">• Session timeout</li>
        <li className="mb-2">• Network connectivity issues</li>
        <li className="mb-2">• Missing required entitlements</li>
      </ul>
      <p className="text-gray-600 mb-6">
        Please try refreshing the page or contact your administrator.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 bg-[#1A73E8] text-white rounded hover:bg-[#1557b0] transition-colors text-sm font-medium"
      >
        Refresh Page
      </button>
    </div>
  );

  const SourceUploadView = () => (
    <div className="px-5">
      <div className="flex items-center mb-4">
        <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded mr-2">
          <ChevronLeft size={20} className="text-[#5f6368]" />
        </button>
        <h3 className="text-[15px] font-medium text-[#202124]">Add Sources</h3>
      </div>

      <p className="text-[#5f6368] mb-6">
        Sources let gemini base its responses on the information that matters most to you.
        (Examples: marketing plans, course reading, research notes, meeting transcripts,
        sales documents, etc.)
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-[#dadce0] rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-[#e8f0fe] rounded-full flex items-center justify-center mx-auto mb-4">
            <FileDown className="text-[#4285f4]" />
          </div>
          <h3 className="font-medium text-[#202124] mb-2">Upload sources</h3>
          <p className="text-[#5f6368] mb-2">Drag and drop or <button className="text-[#4285f4]">choose file</button> to upload</p>
          <p className="text-[#5f6368] text-sm">Supported file types: PDF, txt, Markdown</p>
        </div>

        <div className="border border-[#dadce0] rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-[#e8f0fe] rounded-full flex items-center justify-center mx-auto mb-4">
            <Clipboard className="text-[#4285f4]" />
          </div>
          <h3 className="font-medium text-[#202124] mb-2">Paste text</h3>
          <p className="text-[#5f6368] mb-2">Paste SQL queries and translate into LookML</p>
          <button className="text-[#4285f4]">Copied text</button>
        </div>
      </div>

      {addedSources.length > 0 && (
        <div className="mt-8">
          <h3 className="font-medium text-[#202124] mb-4">Added Source</h3>
          <div className="border border-[#dadce0] rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#dadce0]">
                  <th className="text-left p-4 text-[#5f6368] font-normal">File name</th>
                  <th className="text-left p-4 text-[#5f6368] font-normal">Date Added</th>
                  <th className="text-left p-4 text-[#5f6368] font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {addedSources.map((source) => (
                  <tr key={source.name} className="border-b border-[#dadce0] last:border-0">
                    <td className="p-4 flex items-center gap-2">
                      <FileText size={16} className="text-[#5f6368]" />
                      {source.name}
                    </td>
                    <td className="p-4 text-[#5f6368]">{source.date}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => removeSource(source.name)}
                        className="text-[#d93025] hover:underline"
                      >
                        Remove Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button 
          onClick={() => setShowSourceUpload(false)}
          className="px-6 py-2 text-[#4285f4] font-medium hover:bg-[#f8fbff] rounded"
        >
          Done
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1">
      {/* Show connection error if there's a connection issue */}
      {connectionError ? (
        <div className="flex-1 bg-white">
          <ConnectionErrorMessage />
        </div>
      ) : (
        <>
          {/* Main Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {showCodeEditor ? (
              <>
                <FileBrowser onFileSelect={handleFileSelect} selectedFile={selectedFile?.name} />
                {selectedFile && <CodeEditor file={selectedFile} />}
              </>
            ) : (
              <div className="flex-1 bg-white overflow-auto">
                <div className="p-6 flex justify-center items-center min-h-[calc(100vh-120px)]">
                  <div className="max-w-lg text-center">
                    <div className="w-[320px] h-[180px] mx-auto mb-6">
                      <img src={GEMINI_LOGO} alt="Gemini" className="w-full h-full object-contain" />
                    </div>

                    <h2 className="text-2xl font-semibold mb-3 text-gray-900">Start building with Gemini</h2>
                    <p className="text-gray-600 mb-6">Automatic semantic model generation with the power of AI</p>

                    <button 
                      onClick={handleNext}
                      className="px-6 py-2.5 bg-[#1A73E8] text-white rounded hover:bg-[#1557b0] transition-colors text-sm font-medium"
                    >
                      Get started
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="w-[520px] border-l border-gray-200 bg-white overflow-y-auto">
            <div className="flex items-center h-12 px-4 border-b border-gray-200">
              <div className="flex items-center space-x-6">
                <button className="h-12 text-[#1a73e8] border-b-2 border-[#1a73e8] font-medium text-sm">
                  {currentStep}. {steps[currentStep - 1].title}
                </button>
                <span className="text-sm text-[#5f6368]">Applied Steps ({currentStep}/4)</span>
              </div>
              <Maximize2 size={16} className="text-[#5f6368] ml-auto" />
            </div>
            
            {/* Spacer div for consistent padding */}
            <div className="h-8"></div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-5"
                >
                  <LoadingState />
                </motion.div>
              ) : showSourceUpload ? (
                <SourceUploadView />
              ) : (
                <>
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="px-5"
                    >
                      <div className="mb-4">
                        <h2 className="text-[32px] font-bold mb-1 bg-gradient-to-r from-[#4285f4] to-[#8ab4f8] bg-clip-text text-transparent">Hello, John</h2>
                        <p className="text-[#202124] text-lg">Get your model running with Gemini</p>
                      </div>

                      <div>
                        <div className="flex items-center mb-3">
                          <div className="flex items-center text-[#1a73e8]">
                            <Database className="mr-2" size={20} strokeWidth={1.5} />
                            <span className="text-[15px] font-medium">Data Selection</span>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border border-[#dadce0] mb-4">
                          <div className="p-3">
                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#dadce0]">
                              <Star size={16} className="text-[#5f6368]" />
                              <span className="text-[14px] font-medium text-[#202124]">Here is the recommended connection dataset</span>
                            </div>
                            <div className="text-[14px] text-[#5f6368]">
                              <div className="mb-1">Dataset</div>
                              <div className="font-medium text-[#202124] mb-2">gemini-looker-demo-dataset</div>
                              <div className="mb-1">Connection</div>
                              <div className="font-medium text-[#202124]">default_bigquery_connection</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-1 p-2 border-t border-[#dadce0]">
                            <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                              <ThumbsUp size={14} className="text-[#5f6368]" />
                            </button>
                            <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                              <ThumbsDown size={14} className="text-[#5f6368]" />
                            </button>
                            <button className="ml-1 px-3 py-1.5 text-[#1a73e8] hover:bg-[#e8f1fe] rounded text-sm font-medium">
                              + Edit
                            </button>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-start gap-2 mb-2">
                            <span className="text-lg">👋</span>
                            <span className="text-sm font-medium text-[#202124]">Hi! Tell me about your data sources, business objectives, and desired analysis</span>
                          </div>
                          <div className="relative">
                            <textarea
                              value={userInput}
                              onChange={(e) => setUserInput(e.target.value)}
                              className="w-full h-[72px] py-[15px] px-4 pr-10 text-sm text-[#5f6368] border border-[#dadce0] rounded-lg resize-none focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-[#f1f3f4] rounded text-[#1a73e8]">
                              <Send size={16} />
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={handleNext}
                          className="w-full px-4 py-2 bg-[#1A73E8] text-white rounded hover:bg-[#1557b0] transition-colors text-sm font-medium"
                        >
                          Next
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="px-5"
                    >
                      <div className="flex items-center mb-4">
                        <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded mr-2">
                          <ChevronLeft size={20} className="text-[#5f6368]" />
                        </button>
                        <div className="flex items-center gap-2">
                          <Table2 size={20} className="text-[#4285F4]" />
                          <h3 className="text-[15px] font-medium text-[#202124]">Table selection</h3>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg border border-[#dadce0] mb-4">
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-4 p-4 border-b border-[#dadce0]">
                            <span className="text-[14px] font-medium text-[#202124]">Based on your objectives, here are some suggested tables</span>
                          </div>
                          <div className="space-y-2">
                            {['order_items', 'products', 'users'].map((table) => (
                              <button
                                key={table}
                                onClick={() => toggleTable(table)}
                                className={clsx(
                                  "flex items-center gap-2 w-full text-left p-3 rounded-lg",
                                  selectedTables.includes(table)
                                    ? 'bg-[#f8fbff]'
                                    : 'hover:bg-gray-50'
                                )}
                              >
                                <Sparkles size={16} className="text-[#4285F4]" />
                                <span className="text-sm text-[#202124]">{table}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border-t border-[#dadce0]">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                              <ThumbsUp size={14} className="text-[#5f6368]" />
                            </button>
                            <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                              <ThumbsDown size={14} className="text-[#5f6368]" />
                            </button>
                          </div>
                          <button className="flex items-center gap-1 text-[#4285F4] hover:bg-[#f8fbff] px-3 py-1.5 rounded text-sm font-medium">
                            <Plus size={16} />
                            <span>Select more</span>
                          </button>
                        </div>
                      </div>

                      <button 
                        onClick={handleNext}
                        disabled={selectedTables.length === 0}
                        className="w-full px-4 py-2.5 bg-[#4285F4] text-white rounded-lg hover:bg-[#1557b0] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                      </button>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="px-5"
                    >
                      <div className="flex items-center mb-4">
                        <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded mr-2">
                          <ChevronLeft size={20} className="text-[#5f6368]" />
                        </button>
                        <div className="flex items-center gap-2">
                          <FileText size={20} className="text-[#4285F4]" />
                          <h3 className="text-[15px] font-medium text-[#202124]">Additional Context</h3>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <button 
                          onClick={() => setShowSourceUpload(true)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#dadce0] rounded-lg text-[#4285F4] hover:bg-[#f8fbff] relative"
                        >
                          <Plus size={16} />
                          <span className="font-medium">Add Source</span>
                          {addedSources.length > 0 && (
                            <div className="absolute right-4 flex items-center gap-1 text-[#4285F4]">
                              <Paperclip size={16} />
                              <span className="text-sm">{addedSources.length}</span>
                            </div>
                          )}
                        </button>
                        <div className="relative">
                          <textarea 
                            className="w-full h-32 py-3 px-4 pr-10 text-sm text-[#5f6368] border border-[#dadce0] rounded-lg resize-none focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                            placeholder="Add any specific requirements or instructions for semantic model..."
                          />
                          <button className="absolute right-2 top-3 p-1.5 hover:bg-[#f1f3f4] rounded text-[#1a73e8]">
                            <Send size={16} />
                          </button>
                        </div>
                        <div className="flex justify-between pt-2">
                          <button className="px-6 py-2 text-[#4285f4] font-medium hover:bg-[#f8fbff] rounded">
                            Skip
                          </button>
                          <button 
                            onClick={handleNext}
                            className="px-6 py-2 bg-[#4285f4] text-white rounded hover:bg-[#1557b0] transition-colors font-medium"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="px-5"
                    >
                      <div className="flex items-center mb-4">
                        <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded mr-2">
                          <ChevronLeft size={20} className="text-[#5f6368]" />
                        </button>
                        <div className="flex items-center gap-2">
                          <Code2 size={20} className="text-[#4285F4]" />
                          <h3 className="text-[15px] font-medium text-[#202124]">Generated LookML</h3>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Sparkles size={20} className="text-[#4285F4]" />
                            <span className="text-[15px] text-[#202124]">Generated LookML</span>
                          </div>
                          <button 
                            onClick={() => {
                              setShowFileSnippets(true);
                              setShowCodeEditor(true);
                            }}
                            className="flex items-center gap-1 px-4 py-2 bg-[#4285F4] text-white rounded-lg hover:bg-[#1557b0] transition-colors text-sm font-medium"
                          >
                            <ArrowUpLeft size={16} />
                            <span>Insert All</span>
                          </button>
                        </div>

                        {!showFileSnippets ? (
                          <div>
                            <div className="p-4 bg-[#f8fbff] border border-[#dadce0] rounded-lg mb-4">
                              <p className="text-[14px] text-[#202124]">
                                Based on your data and requirements, I've generated the following LookML files. 
                                Each file can be previewed below. You can insert all files at once or provide feedback on individual files.
                              </p>
                            </div>

                            {/* Model File */}
                            <div className="bg-white rounded-lg border border-[#dadce0] overflow-hidden mb-4">
                              <div className="p-4 bg-[#f8fbff] border-b border-[#dadce0]">
                                <p className="text-[14px] text-[#202124]">
                                  <span className="font-medium">Model File:</span> Defines the relationships between your views and establishes your first Explore.
                                </p>
                              </div>

                              <div className="p-4 border-b border-[#dadce0]">
                                <div className="text-[13px] text-[#5f6368] font-mono mb-2">ecomm.model</div>
                                <div className="max-h-[200px] overflow-y-auto border border-[#dadce0] rounded">
                                  <pre className="font-mono text-[13px] leading-[1.6] text-[#202124] whitespace-pre overflow-x-auto p-3">
                                    <code>{`connection: "big_query_connection"

include: "/views/**/*.view"

datagroup: big_query_connection_project_default_datagroup {
  # sql_trigger: SELECT MAX(id) FROM etl_log;;
  max_cache_age: "1 hour"
}

persist_with: big_query_connection_project_default_datagroup

explore: order_items {
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
}`}</code>
                                  </pre>
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-3 border-t border-[#dadce0]">
                                <div className="flex items-center gap-2">
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <ArrowUpLeft size={16} className="text-[#5f6368]" />
                                  </button>
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <Edit size={16} className="text-[#5f6368]" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <ThumbsUp size={14} className="text-[#5f6368]" />
                                  </button>
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <ThumbsDown size={14} className="text-[#5f6368]" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Order Items View */}
                            <div className="bg-white rounded-lg border border-[#dadce0] overflow-hidden mb-4">
                              <div className="p-4 bg-[#f8fbff] border-b border-[#dadce0]">
                                <p className="text-[14px] text-[#202124]">
                                  <span className="font-medium">Order Items View:</span> Contains order line item data with dimensions and measures for analysis.
                                </p>
                              </div>

                              <div className="p-4 border-b border-[#dadce0]">
                                <div className="text-[13px] text-[#5f6368] font-mono mb-2">views/order_items.view</div>
                                <div className="max-h-[200px] overflow-y-auto border border-[#dadce0] rounded">
                                  <pre className="font-mono text-[13px] leading-[1.6] text-[#202124] whitespace-pre overflow-x-auto p-3">
                                    <code>{`view: order_items {
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

  measure: count {
    type: count
    drill_fields: [id, user_id, product_id]
  }
}`}</code>
                                  </pre>
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-3 border-t border-[#dadce0]">
                                <div className="flex items-center gap-2">
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <ArrowUpLeft size={16} className="text-[#5f6368]" />
                                  </button>
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <Edit size={16} className="text-[#5f6368]" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <ThumbsUp size={14} className="text-[#5f6368]" />
                                  </button>
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <ThumbsDown size={14} className="text-[#5f6368]" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Products View */}
                            <div className="bg-white rounded-lg border border-[#dadce0] overflow-hidden mb-4">
                              <div className="p-4 bg-[#f8fbff] border-b border-[#dadce0]">
                                <p className="text-[14px] text-[#202124]">
                                  <span className="font-medium">Products View:</span> Contains product catalog information with dimensions and measures for product analysis.
                                </p>
                              </div>

                              <div className="p-4 border-b border-[#dadce0]">
                                <div className="text-[13px] text-[#5f6368] font-mono mb-2">views/products.view</div>
                                <div className="max-h-[200px] overflow-y-auto border border-[#dadce0] rounded">
                                  <pre className="font-mono text-[13px] leading-[1.6] text-[#202124] whitespace-pre overflow-x-auto p-3">
                                    <code>{`view: products {
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

  measure: count {
    type: count
    drill_fields: [id, name, category]
  }
}`}</code>
                                  </pre>
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-3 border-t border-[#dadce0]">
                                <div className="flex items-center gap-2">
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <ArrowUpLeft size={16} className="text-[#5f6368]" />
                                  </button>
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <Edit size={16} className="text-[#5f6368]" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <ThumbsUp size={14} className="text-[#5f6368]" />
                                  </button>
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <ThumbsDown size={14} className="text-[#5f6368]" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Users View */}
                            <div className="bg-white rounded-lg border border-[#dadce0] overflow-hidden mb-4">
                              <div className="p-4 bg-[#f8fbff] border-b border-[#dadce0]">
                                <p className="text-[14px] text-[#202124]">
                                  <span className="font-medium">Users View:</span> Contains customer information with dimensions and measures for user analysis.
                                </p>
                              </div>

                              <div className="p-4 border-b border-[#dadce0]">
                                <div className="text-[13px] text-[#5f6368] font-mono mb-2">views/users.view</div>
                                <div className="max-h-[200px] overflow-y-auto border border-[#dadce0] rounded">
                                  <pre className="font-mono text-[13px] leading-[1.6] text-[#202124] whitespace-pre overflow-x-auto p-3">
                                    <code>{`view: users {
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

  measure: count {
    type: count
    drill_fields: [id, first_name, last_name]
  }
}`}</code>
                                  </pre>
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-3 border-t border-[#dadce0]">
                                <div className="flex items-center gap-2">
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <ArrowUpLeft size={16} className="text-[#5f6368]" />
                                  </button>
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <Edit size={16} className="text-[#5f6368]" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <ThumbsUp size={14} className="text-[#5f6368]" />
                                  </button>
                                  <button className="p-1.5 hover:bg-[#f1f3f4] rounded">
                                    <ThumbsDown size={14} className="text-[#5f6368]" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="p-4 bg-[#f8fbff] border border-[#dadce0] rounded-lg mb-4">
                              <p className="text-[14px] text-[#202124]">
                                Your LookML files have been created! Here's a preview of each file:
                              </p>
                            </div>
                            
                            <FileSnippet file={modelFile} title="Model file defines the relationships between your views" />
                            <FileSnippet file={orderItemsFile} title="Order Items view contains order line item data" />
                            <FileSnippet file={productsFile} title="Products view contains product catalog information" />
                            <FileSnippet file={usersFile} title="Users view contains customer information" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default MainContent;

export { MainContent };