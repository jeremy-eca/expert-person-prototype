import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { ConnectionTestService } from '../../../profiles/services/api/connectionTestService';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertCircleIcon, 
  RefreshCwIcon,
  WifiIcon,
  WifiOffIcon
} from 'lucide-react';

interface ConnectionStatus {
  isConnected: boolean;
  message: string;
  details?: any;
  lastChecked?: Date;
}

interface ApiConnectionStatusProps {
  className?: string;
  autoTest?: boolean;
  showDetails?: boolean;
}

export function ApiConnectionStatus({ 
  className = '', 
  autoTest = true,
  showDetails = false 
}: ApiConnectionStatusProps) {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    message: 'Not tested',
    lastChecked: undefined
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const runConnectionTest = async () => {
    setIsLoading(true);
    try {
      const result = await ConnectionTestService.runFullTest();
      setTestResults(result);
      
      setStatus({
        isConnected: result.overallSuccess,
        message: result.overallSuccess 
          ? 'Connected to API successfully'
          : 'Failed to connect to API',
        details: result.tests,
        lastChecked: new Date()
      });
    } catch (error) {
      setStatus({
        isConnected: false,
        message: 'Connection test failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        lastChecked: new Date()
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-test on mount if enabled
  useEffect(() => {
    if (autoTest) {
      runConnectionTest();
    }
  }, [autoTest]);

  const getStatusIcon = () => {
    if (isLoading) {
      return <RefreshCwIcon className="w-4 h-4 animate-spin text-blue-500" />;
    }
    
    if (status.isConnected) {
      return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
    }
    
    return <XCircleIcon className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = () => {
    if (status.isConnected) return 'bg-green-50 border-green-200';
    if (status.lastChecked) return 'bg-red-50 border-red-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  const getStatusBadge = () => {
    if (isLoading) {
      return <Badge variant="outline" className="text-blue-600">Testing...</Badge>;
    }
    
    if (status.isConnected) {
      return <Badge variant="outline" className="text-green-600">Connected</Badge>;
    }
    
    if (status.lastChecked) {
      return <Badge variant="outline" className="text-red-600">Disconnected</Badge>;
    }
    
    return <Badge variant="outline" className="text-yellow-600">Unknown</Badge>;
  };

  return (
    <Card className={`${getStatusColor()} ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status.isConnected ? (
              <WifiIcon className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOffIcon className="w-5 h-5 text-red-600" />
            )}
            <CardTitle className="text-sm font-medium">API Connection</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm">{status.message}</span>
        </div>
        
        {status.lastChecked && (
          <p className="text-xs text-muted-foreground">
            Last checked: {status.lastChecked.toLocaleTimeString()}
          </p>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={runConnectionTest}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCwIcon className="w-3 h-3 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <RefreshCwIcon className="w-3 h-3 mr-2" />
              Test Connection
            </>
          )}
        </Button>
        
        {showDetails && testResults && (
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Test Results:</h4>
            {testResults.tests.map((test: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                {test.success ? (
                  <CheckCircleIcon className="w-3 h-3 text-green-500" />
                ) : (
                  <XCircleIcon className="w-3 h-3 text-red-500" />
                )}
                <span className={test.success ? 'text-green-700' : 'text-red-700'}>
                  {test.name}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {!status.isConnected && status.details && (
          <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-xs">
            <div className="flex items-start gap-2">
              <AlertCircleIcon className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">Connection Issue:</p>
                <p className="text-red-700 mt-1">
                  {status.details.error || 'Unable to establish connection to the API server.'}
                </p>
                <p className="text-red-600 mt-1">
                  Please check your internet connection and verify the API server is running.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}