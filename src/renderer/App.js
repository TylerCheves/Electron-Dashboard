import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import './App.css';
import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faCircleExclamation,
  faArrowUpRightFromSquare,
  faCopy,
  faCode,
  faCircleXmark,
  faCircleCheck,
  faCircleDot,
  faCircleInfo,
  faChevronDoubleRight,
  faChevronRight,
  faChevronLeft,
  faQuestion,
  faCircleQuestion,
  faExchange,
  faSync,
  faChartLine,
  faAnalytics,
  faRadar,
  faPlayCircle,
  faTrashAlt,
  faCode,
  faChevronDown,
  faCircleCheck,
  faCircleXmark,
  faPaperPlane,
  faDownload,
} from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-regular-svg-icons';
import Modal from '/components/Common/Modal';
import { useRouter } from 'next/router';
import ReactTooltip from 'react-tooltip';
import { atom, useAtom } from 'jotai';
import { Dialog, Transition, Menu } from '@headlessui/react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { solarizedDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import axios from 'axios';
import _ from 'lodash';
import sizeof from 'object-sizeof';

export const apis = [
  {
    name: 'Intraday Data API (Delayed)',
    endpoints: [
      {
        name: 'Strikes Chain',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/one-minute/strikes/chain',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#strikes-chain',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
        ],
      },
      {
        name: 'Strikes Chain History',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/hist/one-minute/strikes/chain',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#strikes-chain-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
          {
            name: 'tradeDate',
            required: true,
            placeholder: '202208081000',
            description: 'Date & time using YYYYMMDDHHss format in EST',
            value: '202208081000',
          },
        ],
      },
      {
        name: 'Option by OPRA',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/one-minute/strikes/option',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#option-by-opra',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL23091500175000',
            description:
              'OPRA Symbol using format Ticker + Expiry (YYMMDD) + strike (5 whole numbers and 3 decimals)',
            value: 'AAPL23091500175000',
          },
        ],
      },
      {
        name: 'Option by OPRA History',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/hist/one-minute/strikes/option',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#option-by-opra-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL23091500175000',
            description:
              'OPRA Symbol using format Ticker + Expiry (YYMMDD) + strike (5 whole numbers and 3 decimals)',
            value: 'AAPL23091500175000',
          },
          {
            name: 'tradeDate',
            required: true,
            placeholder: '202208081000',
            description:
              'Date & time formats in EST: YYYYMMDDHHss or YYYYMMDDHHss,YYYYMMDDHHss (there is a 40 trading day max for retrieving data using date and time ranges)',
            value: '202208081000',
          },
        ],
      },
      {
        name: 'Implied Monies',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/one-minute/monies/implied',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#implied-monies',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
        ],
      },
      {
        name: 'Implied Monies History',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/hist/one-minute/monies/implied',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#implied-monies-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
          {
            name: 'tradeDate',
            required: true,
            placeholder: '202208081000',
            description:
              'Date & time formats in EST: YYYYMMDD or YYYYMMDDHHss or YYYYMMDD,YYYYMMDD or YYYYMMDDHHss,YYYYMMDDHHss (there is a 20 trading day max for retrieving data using date and time ranges)',
            value: '202208081000',
          },
        ],
      },
      {
        name: 'Summaries',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/one-minute/summaries',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#summaries',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: false,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
        ],
      },
      {
        name: 'Summaries History',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/hist/one-minute/summaries',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#summaries-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'tradeDate',
            required: true,
            placeholder: '202208081000',
            description:
              'Date & time formats in EST: YYYYMMDD or YYYYMMDDHHss or YYYYMMDD,YYYYMMDD or YYYYMMDDHHss,YYYYMMDDHHss (there is a 40 trading day max for retrieving data using date and time ranges)',
            value: '202208081000',
          },
          {
            name: 'ticker',
            required: false,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
        ],
      },
    ],
  },
  {
    name: 'Intraday Data API (Live)',
    endpoints: [
      {
        name: 'Strikes Chain',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/live/one-minute/strikes/chain',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#strikes-chain',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
        ],
      },
      {
        name: 'Strikes Chain History',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/hist/live/one-minute/strikes/chain',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#strikes-chain-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
          {
            name: 'tradeDate',
            required: true,
            placeholder: '202208081000',
            description: 'Date & time using YYYYMMDDHHss format in EST',
            value: '202208081000',
          },
        ],
      },
      {
        name: 'Option by OPRA',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/live/one-minute/strikes/option',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#option-by-opra',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL23091500175000',
            description:
              'OPRA Symbol using format Ticker + Expiry (YYMMDD) + strike (5 whole numbers and 3 decimals)',
            value: 'AAPL23091500175000',
          },
        ],
      },
      {
        name: 'Option by OPRA History',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/hist/live/one-minute/strikes/option',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#option-by-opra-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL23091500175000',
            description:
              'OPRA Symbol using format Ticker + Expiry (YYMMDD) + strike (5 whole numbers and 3 decimals)',
            value: 'AAPL23091500175000',
          },
          {
            name: 'tradeDate',
            required: true,
            placeholder: '202208081000',
            description:
              'Date & time formats in EST: YYYYMMDDHHss or YYYYMMDDHHss,YYYYMMDDHHss (there is a 40 trading day max for retrieving data using date and time ranges)',
            value: '202208081000',
          },
        ],
      },
      {
        name: 'Implied Monies',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/live/one-minute/monies/implied',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#implied-monies',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
        ],
      },
      {
        name: 'Implied Monies History',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/hist/live/one-minute/monies/implied',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#implied-monies-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
          {
            name: 'tradeDate',
            required: true,
            placeholder: '202208081000',
            description:
              'Date & time formats in EST: YYYYMMDD or YYYYMMDDHHss or YYYYMMDD,YYYYMMDD or YYYYMMDDHHss,YYYYMMDDHHss (there is a 20 trading day max for retrieving data using date and time ranges)',
            value: '202208081000',
          },
        ],
      },
      {
        name: 'Summaries',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/live/one-minute/summaries',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#summaries',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: false,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
        ],
      },
      {
        name: 'Summaries History',
        type: 'GET',
        outputFormat: 'csv',
        url: '/datav2/hist/live/one-minute/summaries',
        docs: 'https://docs.orats.io/one-minute-api-guide/data.html#summaries-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'tradeDate',
            required: true,
            placeholder: '202208081000',
            description:
              'Date & time formats in EST: YYYYMMDD or YYYYMMDDHHss or YYYYMMDD,YYYYMMDD or YYYYMMDDHHss,YYYYMMDDHHss (there is a 40 trading day max for retrieving data using date and time ranges)',
            value: '202208081000',
          },
          {
            name: 'ticker',
            required: false,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
        ],
      },
    ],
  },
  {
    name: 'Data API (Delayed)',
    endpoints: [
      {
        name: 'Tickers',
        type: 'GET',
        url: '/datav2/tickers',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#tickers',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description:
              'Stock symbol (multiple symbols should be comma delimited)',
            value: 'AAPL',
          },
        ],
      },
      {
        name: 'Strikes',
        type: 'GET',
        url: '/datav2/strikes',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#strikes',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description:
              'Stock symbol (multiple symbols should be comma delimited)',
            value: 'AAPL',
          },
          {
            name: 'fields',
            definitionsId: 'strikes',
            required: false,
            placeholder: 'ticker,tradeDate',
            description: 'The fields to retrieve',
            value: '',
          },
          {
            name: 'dte',
            required: false,
            placeholder: '30,45',
            description: 'Filter by DTE range',
            value: '',
          },
          {
            name: 'delta',
            required: false,
            placeholder: '.30,.45',
            description: 'Filter by delta range',
            value: '',
          },
        ],
      },
      {
        name: 'Strikes History',
        type: 'GET',
        url: '/datav2/hist/strikes',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#strikes-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description:
              'Stock symbol (multiple symbols should be comma delimited)',
            value: 'AAPL',
          },
          {
            name: 'tradeDate',
            required: true,
            placeholder: '2022-08-08',
            description: 'The trade date to retrieve',
            value: '2022-08-08',
          },
          {
            name: 'fields',
            definitionsId: 'strikes',
            required: false,
            placeholder: 'ticker,tradeDate',
            description: 'The fields to retrieve',
            value: '',
          },
          {
            name: 'dte',
            required: false,
            placeholder: '30,45',
            description: 'Filter by DTE range',
            value: '',
          },
          {
            name: 'delta',
            required: false,
            placeholder: '.30,.45',
            description: 'Filter by delta range',
            value: '',
          },
        ],
      },
      {
        name: 'Strikes by Options',
        type: 'GET',
        url: '/datav2/strikes/options',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#strikes-by-options',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
          {
            name: 'expirDate',
            required: true,
            placeholder: '2023-09-15',
            description: 'The expiration date to retrieve',
            value: '2023-09-15',
          },
          {
            name: 'strike',
            required: true,
            placeholder: '175',
            description: 'The strike price to retrieve',
            value: '175',
          },
        ],
      },
      {
        name: 'Strikes History by Options',
        type: 'GET',
        url: '/datav2/hist/strikes/options',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#strikes-history-by-options',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
          {
            name: 'expirDate',
            required: true,
            placeholder: '2023-09-15',
            description: 'The expiration date to retrieve',
            value: '2023-09-15',
          },
          {
            name: 'strike',
            required: true,
            placeholder: '175',
            description: 'The strike price to retrieve',
            value: '175',
          },
          {
            name: 'tradeDate',
            required: false,
            placeholder: '2022-08-08',
            description: 'The trade date to retrieve',
            value: '',
          },
        ],
      },
      {
        name: 'Monies Implied',
        type: 'GET',
        url: '/datav2/monies/implied',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#monies',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description:
              'Stock symbol (multiple symbols should be comma delimited)',
            value: 'AAPL',
          },
          {
            name: 'fields',
            definitionsId: 'moniesImplied',
            required: false,
            placeholder: 'ticker,tradeDate',
            description: 'The fields to retrieve',
            value: '',
          },
        ],
      },
      {
        name: 'Monies Forecast',
        type: 'GET',
        url: '/datav2/monies/forecast',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#monies',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description:
              'Stock symbol (multiple symbols should be comma delimited)',
            value: 'AAPL',
          },
          {
            name: 'fields',
            definitionsId: 'moniesForecast',
            required: false,
            placeholder: 'ticker,tradeDate',
            description: 'The fields to retrieve',
            value: '',
          },
        ],
      },
      {
        name: 'Monies Implied History',
        type: 'GET',
        url: '/datav2/hist/monies/implied',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#monies-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description:
              'Stock symbol (multiple symbols should be comma delimited)',
            value: 'AAPL',
          },
          {
            name: 'tradeDate',
            required: true,
            placeholder: '2022-08-08',
            description: 'The trade date to retrieve',
            value: '2022-08-08',
          },
          {
            name: 'fields',
            definitionsId: 'moniesImplied',
            required: false,
            placeholder: 'ticker,tradeDate',
            description: 'The fields to retrieve',
            value: '',
          },
        ],
      },
      {
        name: 'Monies Forecast History',
        type: 'GET',
        url: '/datav2/hist/monies/forecast',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#monies-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description:
              'Stock symbol (multiple symbols should be comma delimited)',
            value: 'AAPL',
          },
          {
            name: 'tradeDate',
            required: true,
            placeholder: '2022-08-08',
            description: 'The trade date to retrieve',
            value: '2022-08-08',
          },
          {
            name: 'fields',
            definitionsId: 'moniesForecast',
            required: false,
            placeholder: 'ticker,tradeDate',
            description: 'The fields to retrieve',
            value: '',
          },
        ],
      },
      {
        name: 'SMV Summaries',
        type: 'GET',
        url: '/datav2/summaries',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#smv-summaries',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: false,
            placeholder: 'AAPL',
            description:
              'Stock symbol (multiple symbols should be comma delimited)',
            value: '',
          },
          {
            name: 'fields',
            definitionsId: 'summaries',
            required: false,
            placeholder: 'ticker,tradeDate',
            description: 'The fields to retrieve',
            value: '',
          },
        ],
      },
      {
        name: 'Summaries History',
        type: 'GET',
        url: '/datav2/hist/summaries',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#summaries-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: false,
            placeholder: 'AAPL',
            description:
              'Stock symbol (multiple symbols should be comma delimited). Required if tradeDate is not set.',
            value: 'AAPL',
          },
          {
            name: 'tradeDate',
            required: false,
            placeholder: '2022-08-08',
            description:
              'The trade date to retrieve. Required if ticker is not set.',
            value: '',
          },
          {
            name: 'fields',
            definitionsId: 'summaries',
            required: false,
            placeholder: 'ticker,tradeDate',
            description: 'The fields to retrieve',
            value: '',
          },
        ],
      },
      {
        name: 'Core Data',
        type: 'GET',
        url: '/datav2/cores',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#core-data',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: false,
            placeholder: 'AAPL',
            description:
              'Stock symbol (multiple symbols should be comma delimited)',
            value: '',
          },
          {
            name: 'fields',
            definitionsId: 'cores',
            required: false,
            placeholder: 'ticker,tradeDate',
            description: 'The fields to retrieve',
            value: '',
          },
        ],
      },
      {
        name: 'Core Data History',
        type: 'GET',
        url: '/datav2/hist/cores',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#core-data-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: false,
            placeholder: 'AAPL',
            description:
              'Stock symbol (multiple symbols should be comma delimited). Required if tradeDate is not set.',
            value: 'AAPL',
          },
          {
            name: 'tradeDate',
            required: false,
            placeholder: '2022-08-08',
            description:
              'The trade date to retrieve. Required if ticker is not set.',
            value: '',
          },
          {
            name: 'fields',
            definitionsId: 'cores',
            required: false,
            placeholder: 'ticker,tradeDate',
            description: 'The fields to retrieve',
            value: '',
          },
        ],
      },
      {
        name: 'Daily Price',
        type: 'GET',
        url: '/datav2/hist/dailies',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#daily-price',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: false,
            placeholder: 'AAPL',
            description:
              'Stock symbol (multiple symbols should be comma delimited). Required if tradeDate is not set.',
            value: 'AAPL',
          },
          {
            name: 'tradeDate',
            required: false,
            placeholder: '2022-08-08',
            description:
              'The trade date to retrieve. Required if ticker is not set.',
            value: '',
          },
          {
            name: 'fields',
            definitionsId: 'dailyPrice',
            required: false,
            placeholder: 'ticker,tradeDate',
            description: 'The fields to retrieve',
            value: '',
          },
        ],
      },
      {
        name: 'Historical Volatility',
        type: 'GET',
        url: '/datav2/hist/hvs',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#historical-volatility',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: false,
            placeholder: 'AAPL',
            description:
              'Stock symbol (multiple symbols should be comma delimited). Required if tradeDate is not set.',
            value: 'AAPL',
          },
          {
            name: 'tradeDate',
            required: false,
            placeholder: '2022-08-08',
            description:
              'The trade date to retrieve. Required if ticker is not set.',
            value: '',
          },
          {
            name: 'fields',
            definitionsId: 'historicalVolatility',
            required: false,
            placeholder: 'ticker,tradeDate',
            description: 'The fields to retrieve',
            value: '',
          },
        ],
      },
      {
        name: 'Dividend History',
        type: 'GET',
        url: '/datav2/hist/divs',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#dividend-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
        ],
      },
      {
        name: 'Earnings History',
        type: 'GET',
        url: '/datav2/hist/earnings',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#dividend-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
        ],
      },
      {
        name: 'Stock Split History',
        type: 'GET',
        url: '/datav2/hist/splits',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#stock-split-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
        ],
      },
      {
        name: 'IV Rank',
        type: 'GET',
        url: '/datav2/ivrank',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#iv-rank',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: false,
            placeholder: 'AAPL',
            description:
              'Stock symbol (multiple symbols should be comma delimited)',
            value: '',
          },
          {
            name: 'fields',
            definitionsId: 'ivRank',
            required: false,
            placeholder: 'ticker,tradeDate',
            description: 'The fields to retrieve',
            value: '',
          },
        ],
      },
      {
        name: 'IV Rank History',
        type: 'GET',
        url: '/datav2/hist/ivrank',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-api-guide/data.html#iv-rank-history',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: false,
            placeholder: 'AAPL',
            description:
              'Stock symbol (multiple symbols should be comma delimited). Required if tradeDate is not set.',
            value: 'AAPL',
          },
          {
            name: 'tradeDate',
            required: false,
            placeholder: '2022-08-08',
            description:
              'The trade date to retrieve. Required if ticker is not set.',
            value: '',
          },
          {
            name: 'fields',
            definitionsId: 'ivRank',
            required: false,
            placeholder: 'ticker,tradeDate',
            description: 'The fields to retrieve',
            value: '',
          },
        ],
      },
    ],
  },
  {
    name: 'Data API (Live)',
    endpoints: [
      {
        name: 'Strikes',
        type: 'GET',
        url: '/datav2/live/strikes',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-live-api-guide/data.html#strikes',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
        ],
      },
      {
        name: 'Strikes by Expiry',
        type: 'GET',
        url: '/datav2/live/strikes/monthly',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-live-api-guide/data.html#strikes-by-expiry',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
          {
            name: 'expiry',
            required: true,
            placeholder: '2023-09-15',
            description: 'Comma delimited expiration dates',
            value: '2023-09-15',
          },
        ],
      },
      {
        name: 'Strikes by Options',
        type: 'GET',
        url: '/datav2/live/strikes/options',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-live-api-guide/data.html#strikes-by-options',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL2023-09-15C175',
            description: 'Comma delimited option symbols',
            value: 'AAPL2023-09-15C175',
          },
        ],
      },
      {
        name: 'Expiration Dates',
        type: 'GET',
        url: '/datav2/live/expirations',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-live-api-guide/data.html#expiration-dates',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
          {
            name: 'include',
            required: false,
            placeholder: 'true',
            description: 'Include list of strikes (true or false)',
            value: '',
          },
        ],
      },
      {
        name: 'Monies Implied',
        type: 'GET',
        url: '/datav2/live/monies/implied',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-live-api-guide/data.html#monies',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
        ],
      },
      {
        name: 'Monies Forecast',
        type: 'GET',
        url: '/datav2/live/monies/forecast',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-live-api-guide/data.html#monies',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
        ],
      },
      {
        name: 'SMV Summaries',
        type: 'GET',
        url: '/datav2/live/summaries',
        outputFormat: 'json',
        docs: 'https://docs.orats.io/datav2-live-api-guide/data.html#smv-summaries',
        parameters: [
          {
            name: 'token',
            required: true,
            placeholder: 'token',
            description: 'Your API token',
            value: 'token',
          },
          {
            name: 'ticker',
            required: true,
            placeholder: 'AAPL',
            description: 'Stock symbol',
            value: 'AAPL',
          },
        ],
      },
    ],
  },
];

const sidebarOpenAtom = atom(false);
const selectedApiAtom = atom(apis[1]);
const selectedEndpointAtom = atom(apis[1].endpoints[0]);
const userApiTokenAtom = atom('8ce0dfcb-687f-40bc-8cf9-c6b14c367ada');

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}

function Main() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);
  const [userApiToken, setUserApiToken] = useAtom(userApiTokenAtom);
  const [selectedApi, setSelectedApi] = useAtom(selectedApiAtom);
  const [selectedEndpoint, setSelectedEndpoint] = useAtom(selectedEndpointAtom);
  const [isCopied, setIsCopied] = useState(false);

  function copyApiToken() {
    setIsCopied(true);
    navigator.clipboard.writeText(userApiToken);
    const timer = setTimeout(() => {
      setIsCopied(false);
    }, 5000);
    return () => clearTimeout(timer);
  }

  const [apiOverviews, setApiOverviews] = useState([
    {
      title: [
        <span
          key="title-italic"
          className="italic font-normal text-red-600 mr-1"
        >
          Intraday
        </span>,
        ' Data API',
      ],
      tag: 'NEW',
      description: [
        "Get down-to-the-minute summaries and option chain data since August 2020. Drill down to request current and historical information on an option's OPRA for the top 1,270 tickers back to January 2022. Request symbols you need OPRA for if not in ",
        <a
          href="https://s3.amazonaws.com/assets.orats.com/oneMinuteOpraTickers.json"
          target="_blank"
          rel="noreferrer"
          className="underline text-orange-500 cursor-pointer"
          key="description-link"
        >
          our list
        </a>,
        '. Access to live data requires an active Tradier account.',
      ],
      apisIndex: 0,
      delayedIndex: 0,
      liveIndex: 1,
      delayedInfo:
        'Delayed data is available for all API users and is delayed 15 minutes. Delayed and live endpoints will behave the same way unless the tradeDate parameter is the current day.',
      liveInfo:
        'Live data is calculated in real-time with less than 10 seconds of market delay. An active Tradier account is required to gain access. Live history endpoints can pull in data from between now and 15 minutes ago.',
    },
    {
      title: ['Data API'],
      tag: 'POPULAR',
      description: [
        'Get delayed intraday updates for over 5,000 symbols, and get end-of-day historical options data since 2007. This includes all industry standard options data and over 700 proprietary indicators gathered 14 minutes before the close for the highest data quality. Access to live data requires an active Tradier account.',
      ],
      apisIndex: 2,
      delayedIndex: 2,
      liveIndex: 3,
      delayedInfo:
        'Delayed data is available for all API users and is delayed 15 minutes.',
      liveInfo:
        'Live data is calculated in real-time with less than 10 seconds of market delay. An active Tradier account is required to gain access.',
    },
  ]);

  return (
    <div className="h-screen flex flex-row overflow-hidden font-default">
      <div
        className={
          'relative flex-1 flex flex-col bg-gray-50 overflow-y-scroll overflow-x-hidden font-default font-semibold'
        }
      >
        <div className="absolute h-28 top-0 w-full bg-gradient-to-r from-slate-600 to-slate-400"></div>
        <div className="relative z-10 px-10 w-full">
          <div className="mt-6 flex flex-row text-white">
            <div className="text-2xl">API Console</div>
          </div>
        </div>
        <div className="min-w-[68rem] z-10 relative mt-4 px-10">
          <div className="flex flex-row space-x-10">
            <div className="flex-none rounded-lg bg-white shadow-lg px-5 py-4">
              <div className="text-xs text-slate-500">Your API Token</div>

              <div className="flex flex-row space-x-3 items-center">
                <div className="mt-1 text-xl font-bold font-code">
                  {userApiToken}
                </div>
                <div
                  className="w-4"
                  data-tip
                  data-for="copyApiToken"
                  onClick={() => {
                    copyApiToken();
                  }}
                >
                  <FontAwesomeIcon
                    className="text-slate-500 cursor-pointer transition hover:text-black"
                    icon={faCopy}
                    aria-hidden="true"
                  />
                  {isMounted ? (
                    <ReactTooltip
                      id="copyApiToken"
                      className="w-36 font-medium text-center"
                      place="top"
                      effect="solid"
                    >
                      {isCopied ? 'Copied!' : 'Copy API Token'}
                    </ReactTooltip>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-row items-center">
            <div className="text-xl">ORATS APIs</div>
            <div className="ml-5 bg-slate-200 rounded-md px-2.5 py-1.5 text-sm font-code font-normal text-slate-700">
              {'https://api.orats.io'}
            </div>
          </div>
          <div className="mt-5 bg-slate-200 h-px w-full rounded-full"></div>
          {apiOverviews.map((api, apiIndex) => (
            <div
              key={'api-' + apiIndex}
              className="mt-8 mb-16 flex flex-row space-x-10"
            >
              <div className="w-1/6">
                <div className="text-lg">{api.title}</div>
                <div className="mt-2 inline-block text-xs text-white bg-orange-500 rounded-md px-2.5 py-1">
                  {api.tag}
                </div>
                <div className="mt-2.5 text-sm font-normal">
                  {api.description}
                </div>
              </div>
              <div className="w-5/6">
                <div className="mt-1 flex flex-row items-center font-medium">
                  <div
                    className="flex flex-row items-center cursor-pointer"
                    onClick={() => {
                      let _apiOverviews = [...apiOverviews];
                      _apiOverviews[apiIndex].apisIndex =
                        _apiOverviews[apiIndex].delayedIndex;
                      setApiOverviews(_apiOverviews);
                    }}
                  >
                    {api.apisIndex == api.delayedIndex ? (
                      <FontAwesomeIcon
                        className="text-orange-500 text-sm"
                        icon={faCircleDot}
                        aria-hidden="true"
                      />
                    ) : (
                      <FontAwesomeIcon
                        className="text-sm"
                        icon={faCircle}
                        aria-hidden="true"
                      />
                    )}
                    <div className="ml-1">Delayed</div>
                    <div
                      data-tip
                      data-for={api.title + '-delayedData'}
                      className="ml-1.5"
                    >
                      <FontAwesomeIcon
                        className="text-slate-400/60"
                        icon={faCircleInfo}
                        aria-hidden="true"
                      />
                    </div>
                    {isMounted ? (
                      <ReactTooltip
                        id={api.title + '-delayedData'}
                        className="w-96 font-medium text-center"
                        place="top"
                        effect="solid"
                      >
                        {api.delayedInfo}
                      </ReactTooltip>
                    ) : null}
                  </div>
                  <div
                    className="ml-7 flex flex-row items-center cursor-pointer"
                    onClick={() => {
                      let _apiOverviews = [...apiOverviews];
                      _apiOverviews[apiIndex].apisIndex =
                        _apiOverviews[apiIndex].liveIndex;
                      setApiOverviews(_apiOverviews);
                    }}
                  >
                    {api.apisIndex == api.delayedIndex ? (
                      <FontAwesomeIcon
                        className="text-sm"
                        icon={faCircle}
                        aria-hidden="true"
                      />
                    ) : (
                      <FontAwesomeIcon
                        className="text-orange-500 text-sm"
                        icon={faCircleDot}
                        aria-hidden="true"
                      />
                    )}
                    <div className="ml-1">Live</div>
                    <div
                      data-tip
                      data-for={api.title + '-liveData'}
                      className="ml-1.5"
                    >
                      <FontAwesomeIcon
                        className="text-slate-400/60"
                        icon={faCircleInfo}
                        aria-hidden="true"
                      />
                    </div>
                    {isMounted ? (
                      <ReactTooltip
                        id={api.title + '-liveData'}
                        className="w-96 font-medium text-center"
                        place="top"
                        effect="solid"
                      >
                        {api.liveInfo}
                      </ReactTooltip>
                    ) : null}
                  </div>
                </div>
                <div className="mt-3.5 bg-white shadow-lg rounded-lg font-medium">
                  <div className="flex flex-row bg-slate-200 rounded-t-lg h-9 px-4 pt-2.5 space-x-3">
                    <div className="w-[22%] text-xs text-slate-600">
                      Endpoint
                    </div>
                    <div className="flex-none w-12 text-xs text-slate-600">
                      Type
                    </div>
                    <div className="w-[30%] text-xs text-slate-600">URL</div>
                    <div className="w-[28%] text-xs text-slate-600">
                      Parameters
                    </div>
                    <div className="flex flex-grow w-44"></div>
                  </div>
                  {apis[api.apisIndex].endpoints.map(
                    (endpoint, endpointIndex) => (
                      <div
                        key={'api-' + apiIndex + '-endpoint-' + endpointIndex}
                        className={
                          'flex flex-row px-4 items-top pt-3.5 pb-1.5 space-x-3' +
                          (endpointIndex <
                          apis[api.apisIndex].endpoints.length - 1
                            ? ' border-b'
                            : '')
                        }
                      >
                        <div className="w-[22%] text-sm pt-1 pr-2">
                          {endpoint.name}
                        </div>
                        <div className="flex-none font-code w-12 h-7 px-3 text-xs bg-slate-200 text-slate-700 rounded-md flex items-center justify-center">
                          {endpoint.type}
                        </div>
                        <div className="font-code truncate w-[30%] pt-1.5 text-xs">
                          {endpoint.url}
                        </div>
                        <div className="w-[28%] flex flex-wrap">
                          {endpoint.parameters.map(
                            (parameter, parameterIndex) => (
                              <div
                                key={
                                  'api-' +
                                  apiIndex +
                                  '-endpoint-' +
                                  endpointIndex +
                                  '-parameter-' +
                                  parameterIndex
                                }
                                data-tip
                                data-for={
                                  'api-' +
                                  apiIndex +
                                  '-endpoint-' +
                                  endpointIndex +
                                  '-parameter-' +
                                  parameterIndex
                                }
                                className={
                                  'font-code inline-block mr-2 mb-2 h-7 px-2.5 text-xs text-slate-700 rounded-md flex items-center justify-center ' +
                                  (parameter.required
                                    ? 'bg-red-100'
                                    : 'bg-slate-200')
                                }
                              >
                                {parameter.name}
                                {isMounted ? (
                                  <ReactTooltip
                                    id={
                                      'api-' +
                                      apiIndex +
                                      '-endpoint-' +
                                      endpointIndex +
                                      '-parameter-' +
                                      parameterIndex
                                    }
                                    className="max-w-sm font-medium font-default text-center"
                                    place="top"
                                    effect="solid"
                                  >
                                    {parameter.description}
                                  </ReactTooltip>
                                ) : null}
                              </div>
                            )
                          )}
                        </div>
                        <div className="flex flex-grow w-44">
                          <div
                            className="ml-auto text-xs flex items-center justify-center px-2.5 h-7 rounded-md border border-slate-500 text-slate-700 cursor-pointer transition hover:bg-slate-700 hover:text-white hover:border-slate-700 mr-2"
                            onClick={() => {
                              setSelectedApi(apis[api.apisIndex]);
                              setSelectedEndpoint(endpoint);
                              setSidebarOpen(true);
                            }}
                          >
                            Test
                            <FontAwesomeIcon
                              className="ml-1"
                              icon={faCode}
                              aria-hidden="true"
                            />
                          </div>
                          <a
                            href={endpoint.docs == '' ? null : endpoint.docs}
                            className={
                              'text-xs flex items-center justify-center px-2.5 h-7 rounded-md border ' +
                              (endpoint.docs == ''
                                ? 'border-slate-200 text-slate-400'
                                : 'cursor-pointer transition border-slate-500 text-slate-700 hover:bg-slate-700 hover:text-white hover:border-slate-700')
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            Docs
                            <FontAwesomeIcon
                              className="ml-1"
                              icon={faArrowUpRightFromSquare}
                              aria-hidden="true"
                            />
                          </a>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <RightSidebar />
    </div>
  );
}

function RightSidebar() {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);

  const wrapperRef = useRef(null);

  function openSidebar(tabName) {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  useOutsideAlerter(wrapperRef, closeSidebar, true);

  return (
    <div
      className={
        'flex flex-col z-10 bg-slate-100 border-l border-slate-300 shadow-lg transition-width ' +
        (sidebarOpen ? 'w-96' : 'w-16')
      }
      ref={wrapperRef}
    >
      <div className={'h-full ' + (sidebarOpen ? 'hidden' : 'block')}>
        <Transition
          show={!sidebarOpen}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="mt-4 -ml-1 space-y-4 flex flex-col">
            <div
              className="w-full flex flex-col items-center justify-center cursor-pointer"
              onClick={() => {
                openSidebar('API');
              }}
            >
              <div className="bg-slate-600 w-8 h-8 rounded-full text-white flex items-center justify-center text-sm">
                <FontAwesomeIcon icon={faCode} aria-hidden="true" />
              </div>
              <div className="mt-1 text-slate-800 font-semibold text-sm">
                API
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div className={'h-full ' + (sidebarOpen ? 'block' : 'hidden')}>
        <Transition
          show={sidebarOpen}
          className="px-2.5 flex flex-col h-full overflow-y-scroll"
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="flex-none flex flex-row pl-3 pr-2 mt-4 font-medium">
            <div className="mt-0.5 pt-px text-xl font-semibold">API</div>
            <div
              className="text-sm ml-auto cursor-pointer bg-slate-100 flex items-center justify-center rounded-full w-8 h-8 hover:bg-slate-200"
              onClick={closeSidebar}
            >
              <FontAwesomeIcon icon={faChevronDoubleRight} aria-hidden="true" />
            </div>
          </div>
          <Api />
        </Transition>
      </div>
    </div>
  );
}

function Api() {
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);
  const [userApiToken, setUserApiToken] = useAtom(userApiTokenAtom);
  const [selectedApi, setSelectedApi] = useAtom(selectedApiAtom);
  const [selectedEndpoint, setSelectedEndpoint] = useAtom(selectedEndpointAtom);
  const [queryStr, setQueryStr] = useState('');
  const [apiValues, setApiValues] = useState(apis);
  const requestTypes = ['cURL', 'NodeJs', 'PHP', 'Python', 'R'];
  const [selectedRequestType, setSelectedRequestType] = useState('cURL');
  const [requestCode, setRequestCode] = useState('');
  const [responseCode, setResponseCode] = useState(null);
  const [responseCodeLength, setResponseCodeLength] = useState(0);
  const [fetchingResponseCode, setFetchingResponseCode] = useState(false);

  useEffect(() => {
    if (selectedApi.endpoints.some((e) => e.url === selectedEndpoint.url)) {
    } else {
      setSelectedEndpoint(selectedApi.endpoints[0]);
    }
  }, [selectedApi]);

  function updateQueryStr(apiName, endpointName, parameterName, value) {
    let _apiValues = [...apiValues];
    for (let i = 0; i < _apiValues.length; i++) {
      if (_apiValues[i].name == apiName) {
        for (let j = 0; j < _apiValues[i].endpoints.length; j++) {
          if (_apiValues[i].endpoints[j].name == endpointName) {
            for (
              let k = 0;
              k < _apiValues[i].endpoints[j].parameters.length;
              k++
            ) {
              if (
                _apiValues[i].endpoints[j].parameters[k].name == parameterName
              ) {
                _apiValues[i].endpoints[j].parameters[k].value = value;
                break;
              }
            }
            break;
          }
        }
        break;
      }
    }
    setApiValues(_apiValues);
  }

  useEffect(() => {
    let _queryStr = 'https://api.orats.io' + selectedEndpoint.url;
    let paramsStr = '';
    for (let i = 0; i < apiValues.length; i++) {
      if (apiValues[i].name == selectedApi.name) {
        for (let j = 0; j < apiValues[i].endpoints.length; j++) {
          if (apiValues[i].endpoints[j].name == selectedEndpoint.name) {
            let params = apiValues[i].endpoints[j].parameters;
            for (let k = 0; k < params.length; k++) {
              if (params[k].value !== '') {
                paramsStr += '&' + params[k].name + '=' + params[k].value;
              }
            }
            break;
          }
        }
        break;
      }
    }
    if (paramsStr !== '') {
      paramsStr = paramsStr.substring(1);
      _queryStr += '?' + paramsStr;
    }
    setQueryStr(_queryStr);
    setResponseCode(null);
    setResponseCodeLength(0);
  }, [apiValues]);

  useEffect(() => {
    let _requestCode = '';
    if (selectedRequestType == 'cURL') {
      _requestCode += "curl --location --request GET '" + queryStr + "'";
    } else if (selectedRequestType == 'NodeJs') {
      _requestCode += "var axios = require('axios');\n";
      _requestCode += 'var config = {\n';
      _requestCode += "\tmethod: 'get',\n";
      _requestCode += "\turl: '" + queryStr + "',\n";
      _requestCode += '\theaders: { }';
      _requestCode += '};\n';
      _requestCode += 'axios(config)\n';
      _requestCode += '\t.then(function (response) {\n';
      _requestCode += '\t\tconsole.log(JSON.stringify(response.data));\n';
      _requestCode += '\t})\n';
      _requestCode += '\t.catch(function (error) {\n';
      _requestCode += '\t\tconsole.log(error);\n';
      _requestCode += '\t});';
    } else if (selectedRequestType == 'PHP') {
      _requestCode += '$curl = curl_init();\n';
      _requestCode += 'curl_setopt_array($curl, array(\n';
      _requestCode += "\tCURLOPT_URL => '" + queryStr + "',\n";
      _requestCode += '\tCURLOPT_RETURNTRANSFER => true,\n';
      _requestCode += "\tCURLOPT_ENCODING => '',\n";
      _requestCode += '\tCURLOPT_MAXREDIRS => 10,\n';
      _requestCode += '\tCURLOPT_TIMEOUT => 0,\n';
      _requestCode += '\tCURLOPT_FOLLOWLOCATION => true,\n';
      _requestCode += '\tCURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,\n';
      _requestCode += "\tCURLOPT_CUSTOMREQUEST => 'GET',\n";
      _requestCode += '));\n';
      _requestCode += '$response = curl_exec($curl);\n';
      _requestCode += 'curl_close($curl);\n';
      _requestCode += 'echo $response;\n';
    } else if (selectedRequestType == 'Python') {
      _requestCode += 'import requests\n';
      _requestCode += 'url = ' + queryStr + '\n';
      _requestCode += 'payload={}\n';
      _requestCode += 'headers={}\n';
      _requestCode +=
        'response = requests.request("GET", url, headers=headers, data=payload)\n';
      _requestCode += 'print(response.text)';
    } else if (selectedRequestType == 'R') {
      _requestCode += 'library(RCurl)\n';
      _requestCode +=
        'res <- getURL("' +
        queryStr +
        '", .opts=list(followlocation = TRUE))\n';
      _requestCode += 'cat(res)';
    }
    setRequestCode(_requestCode);
  }, [queryStr, selectedRequestType]);

  const updateValue = _.debounce((el) => {
    if (el.scrollHeight - el.scrollTop < 1500) {
      let num = responseCodeLength + 400;
      setResponseCodeLength(num);
    }
  }, 20);

  const [isCopied, setIsCopied] = useState(false);
  function copyJson() {
    setIsCopied(true);
    navigator.clipboard.writeText(responseCode);
    const timer = setTimeout(() => {
      setIsCopied(false);
    }, 5000);
    return () => clearTimeout(timer);
  }

  return (
    <div className="px-3 mt-3 pb-10">
      <div className="text-sm">
        Explore and test various ORATS API endpoints using your token.
      </div>
      <div className="mt-3 w-full h-px rounded-full bg-slate-300/70"></div>
      <div className="mt-3 text-sm text-slate-600">API</div>
      <div className="relative z-30">
        <Menu>
          <Menu.Button className="mt-2 flex flex-row w-full rounded-md border border-slate-300 shadow-sm px-3 py-2 bg-white text-sm font-medium focus:outline-none">
            <div className="flex-grow text-left">{selectedApi.name}</div>
            <div>
              <FontAwesomeIcon icon={faChevronDown} aria-hidden="true" />
            </div>
          </Menu.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items className="absolute font-medium py-0.5 px-0.5 mt-1.5 w-full rounded-md shadow-lg bg-white ring-1 ring-slate-300 focus:outline-none">
              {apiValues.map(function (api, apiIndex) {
                return (
                  <Menu.Item key={'api-' + apiIndex}>
                    {({ active }) => (
                      <div
                        className={
                          'flex flex-row items-baseline rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-slate-200/70' +
                          (active ? ' bg-slate-200/70' : '')
                        }
                        onClick={() => {
                          setSelectedApi(api);
                        }}
                      >
                        {api.name}
                      </div>
                    )}
                  </Menu.Item>
                );
              })}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <div className="flex flex-row w-full mt-5 text-sm text-slate-600 space-x-4">
        <div className="w-3/4">Endpoint</div>
        <div className="w-1/4">Type</div>
      </div>
      <div className="relative z-20 flex flex-row w-full space-x-4 items-baseline">
        <Menu as="div" className="w-3/4">
          <Menu.Button className="mt-2 flex flex-row w-full rounded-md border border-slate-300 shadow-sm px-3 py-2 bg-white text-sm font-medium focus:outline-none">
            <div className="flex-grow text-left">{selectedEndpoint.name}</div>
            <div>
              <FontAwesomeIcon icon={faChevronDown} aria-hidden="true" />
            </div>
          </Menu.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items className="absolute font-medium py-0.5 px-0.5 mt-1.5 w-full max-h-96 overflow-scroll rounded-md shadow-lg bg-white ring-1 ring-slate-300 focus:outline-none">
              {selectedApi.endpoints.map(function (endpoint, endpointIndex) {
                return (
                  <Menu.Item key={'endpoint-' + endpointIndex}>
                    {({ active }) => (
                      <div
                        className={
                          'flex flex-row items-baseline rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-slate-200/70' +
                          (active ? ' bg-slate-200/70' : '')
                        }
                        onClick={() => {
                          setSelectedEndpoint(endpoint);
                        }}
                      >
                        {endpoint.name}
                      </div>
                    )}
                  </Menu.Item>
                );
              })}
            </Menu.Items>
          </Transition>
        </Menu>
        <div className="w-1/4 rounded-md border border-slate-300 shadow-sm px-3 py-2 bg-white text-sm font-medium cursor-not-allowed">
          {selectedEndpoint.type}
        </div>
      </div>
      <div className="flex flex-row w-full mt-6 text-sm text-slate-600 items-baseline">
        <div>Parameters</div>
        <div className="ml-3 w-2 h-2 rounded-full bg-red-300"></div>
        <div className="ml-1 text-xs">= required</div>
      </div>
      {selectedEndpoint.parameters.map(function (parameter, parameterIndex) {
        return (
          <Parameter
            key={
              selectedApi.name +
              '-' +
              selectedEndpoint.name +
              '-' +
              parameter.name
            }
            apiName={selectedApi.name}
            endpointName={selectedEndpoint.name}
            parameter={parameter}
            updateQueryStr={updateQueryStr}
          />
        );
      })}
      <div className="mt-6 text-sm text-slate-600">Request</div>
      <div
        className="mt-2.5 rounded-t-lg text-slate-600 flex flex-row text-sm space-x-6 pl-4 pt-3 pb-2"
        style={{ background: 'rgb(0, 43, 54)' }}
      >
        {requestTypes.map(function (requestType, index) {
          return (
            <div
              key={'request-' + requestType}
              className={
                'cursor-pointer transition ' +
                (selectedRequestType == requestType
                  ? 'text-white underline'
                  : 'text-white/30')
              }
              onClick={() => {
                setSelectedRequestType(requestType);
              }}
            >
              {requestType}
            </div>
          );
        })}
      </div>
      <div className="text-xs w-full">
        <SyntaxHighlighter
          style={solarizedDark}
          customStyle={{
            paddingBottom: '24px',
            paddingLeft: '16px',
            paddingRight: '16px',
            borderBottomRightRadius: '8px',
            borderBottomLeftRadius: '8px',
          }}
          language={
            selectedRequestType == 'PHP'
              ? 'php'
              : selectedRequestType == 'Python'
              ? 'python'
              : selectedRequestType == 'R'
              ? 'r'
              : 'javascript'
          }
          showLineNumbers={true}
          showInlineLineNumbers={false}
          wrapLongLines={selectedRequestType == 'cURL'}
          lineProps={{ style: { flexWrap: 'wrap' } }}
        >
          {requestCode}
        </SyntaxHighlighter>
      </div>
      <div className="mt-6 text-sm text-slate-600">Response</div>
      {responseCode === null ? (
        <div className="flex flex-row items-center">
          <div
            className="mt-2 inline-block text-white rounded-lg text-sm font-medium px-4 py-2 bg-emerald-600 cursor-pointer"
            onClick={async () => {
              setFetchingResponseCode(true);

              // Parse the token from the queryStr
              let token = '';
              var pairs = queryStr.split('?')[1].split('&');
              for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i].split('=');
                if (pair[0] == 'token') {
                  token = pair[1];
                }
              }

              try {
                let outputFormat = selectedEndpoint.outputFormat;
                if (outputFormat == 'csv') {
                  let { data } = await axios({
                    url: queryStr,
                    method: 'GET',
                    responseType: 'blob',
                  });
                  let mb = sizeof(data) / 1000000;
                  if (mb > 5.8) {
                    window.open(queryStr, '_blank');
                  } else {
                    const url = window.URL.createObjectURL(new Blob([data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute(
                      'download',
                      selectedEndpoint.name + '.csv'
                    );
                    document.body.appendChild(link);
                    link.click();
                  }
                  setResponseCode(null);
                  setResponseCodeLength(0);
                } else {
                  let { data } = await axios.get(queryStr);
                  setResponseCode(JSON.stringify(data, null, 2));
                  setResponseCodeLength(1000);
                }
              } catch (err) {
                setResponseCode('');
                setResponseCodeLength(100);
              }
              setFetchingResponseCode(false);
            }}
          >
            {selectedEndpoint.outputFormat == 'csv' ? (
              <div>
                Download CSV Output
                <FontAwesomeIcon
                  className="ml-2"
                  icon={faDownload}
                  aria-hidden="true"
                />
              </div>
            ) : (
              <div>
                Fetch JSON Output
                <FontAwesomeIcon
                  className="ml-2"
                  icon={faPaperPlane}
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          {fetchingResponseCode ? (
            <FontAwesomeIcon
              icon={faSpinner}
              className="spinner text-lg text-slate-600 ml-4 mt-2"
              aria-hidden="true"
            />
          ) : null}
        </div>
      ) : responseCode === '' ? (
        <div className="text-sm mt-1.5">
          There was an error processing your request. Please check that all
          required parameters are valid, including your token. Please email{' '}
          <span className="font-semibold">support@orats.com</span> for any
          questions.
        </div>
      ) : (
        <div className="relative">
          <div
            className="absolute right-6 top-2 bg-white/10 rounded-md px-2.5 py-1.5 font-medium text-xs text-white cursor-pointer transition hover:bg-white/30"
            onClick={() => {
              copyJson();
            }}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </div>
          <div className="mt-2 text-xs">
            <SyntaxHighlighter
              style={solarizedDark}
              customStyle={{
                paddingBottom: '24px',
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingTop: '16px',
                borderRadius: '8px',
                maxHeight: '320px',
              }}
              onScroll={(e) => {
                updateValue(e.target);
              }}
              language="json"
              showLineNumbers={true}
              showInlineLineNumbers={false}
              wrapLongLines={selectedRequestType == 'cURL'}
              lineProps={{ style: { flexWrap: 'wrap' } }}
            >
              {responseCode.substring(
                0,
                Math.min(responseCodeLength, responseCode.length)
              )}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
}

function Parameter({ apiName, endpointName, parameter, updateQueryStr }) {
  const [userApiToken, setUserApiToken] = useAtom(userApiTokenAtom);
  const [input, setInput] = useState(parameter.value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [filteredDefinitions, setFilteredDefinitions] = useState(
    parameter.name == 'fields'
      ? Object.keys(dataFieldDefinitions[parameter.definitionsId])
      : null
  );
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (parameter.name == 'token' && parameter.value == 'token') {
      setInput(userApiToken);
    }
  }, [userApiToken]);

  useEffect(() => {
    updateQueryStr(apiName, endpointName, parameter.name, input);
    if (parameter.name == 'fields') {
      let splitInputOrig = input.split(',');
      let splitInput = splitInputOrig[splitInputOrig.length - 1];
      let matchingKeys = [];
      let matchedAlready = false;
      let keys = Object.keys(dataFieldDefinitions[parameter.definitionsId]);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i].includes(splitInput)) {
          matchingKeys.push(keys[i]);
          matchedAlready = true;
        }
      }
      if (matchedAlready === false) {
        for (let i = 0; i < keys.length; i++) {
          if (
            dataFieldDefinitions[parameter.definitionsId][keys[i]].includes(
              splitInput
            )
          ) {
            matchingKeys.push(keys[i]);
          }
        }
      }
      setFilteredDefinitions(matchingKeys);
    }
  }, [input]);

  useEffect(() => {
    updateQueryStr(apiName, endpointName, parameter.name, input);
  }, [apiName, endpointName]);

  const onKeyDown = (event) => {};

  return (
    <div className="flex flex-row items-baseline mt-2">
      {parameter.required ? (
        <div className="w-2 h-2 rounded-full bg-red-300"></div>
      ) : (
        <div className="w-2 h-2 rounded-full"></div>
      )}
      <div className="text-sm ml-2 font-medium">{parameter.name}</div>
      <div className="ml-3 relative flex-grow">
        <input
          type="text"
          name={apiName + '-' + endpointName + '-' + parameter.name}
          id={apiName + '-' + endpointName + '-' + parameter.name}
          className={
            'w-full rounded-md border border-slate-300 shadow-sm px-3 py-2 bg-white text-sm font-medium outline-none focus:outline-none ring-0 focus:ring-0 focus:border-slate-500' +
            (parameter.name == 'ticker' ? ' uppercase' : '')
          }
          placeholder={parameter.placeholder}
          value={input}
          onFocus={() => {
            if (parameter.name == 'fields') {
              setFocusIndex(0);
              setShowSuggestions(true);
            }
          }}
          onChange={(e) => {
            let val = e.target.value;
            if (parameter.name == 'ticker') {
              setInput(val.toUpperCase());
            } else {
              setInput(val);
            }
          }}
          onKeyDown={(e) => {
            if (parameter.name == 'fields') {
              if (e.key == 'Enter' || e.key == 'Tab') {
                event.preventDefault();
                if (filteredDefinitions.length > 0 && focusIndex > -1) {
                  let splitInputs = input.split(',');
                  splitInputs.pop();
                  splitInputs.push(filteredDefinitions[focusIndex]);
                  let joinedInput = splitInputs.join(',');
                  if (e.key == 'Enter') {
                    setShowSuggestions(false);
                    e.target.blur();
                  } else {
                    joinedInput += ',';
                  }
                  setFocusIndex(0);
                  setInput(joinedInput);
                }
              } else if (e.key == 'ArrowDown') {
                event.preventDefault();
                if (focusIndex < filteredDefinitions.length - 1) {
                  setFocusIndex(focusIndex + 1);
                }
              } else if (e.key == 'ArrowUp') {
                event.preventDefault();
                if (focusIndex > 0) setFocusIndex(focusIndex - 1);
              }
            } else {
              if (e.key == 'Enter') {
                e.target.blur();
              }
            }
          }}
          onBlur={() => {
            updateQueryStr(apiName, endpointName, parameter.name, input);
            setShowSuggestions(false);
          }}
          autoComplete="off"
          spellCheck="false"
        />
        {showSuggestions ? (
          <div className="absolute z-10 -mt-2 w-full shadow-lg bg-white rounded-b-lg border-l border-r border-b border-slate-500 pt-1.5 h-52 ">
            <div className="absolute w-full h-px bg-slate-200"></div>
            <div className="px-0.5 h-full">
              <div className="overflow-y-auto overflow-x-hidden h-full flex flex-col scrollbar-white py-1 text-sm">
                {filteredDefinitions.map((key, index) => (
                  <div key={'definition-' + index}>
                    <div
                      className={
                        'px-2.5 py-1.5 cursor-pointer hover:bg-slate-200/80 rounded-md text-xs font-medium' +
                        (index == focusIndex ? ' bg-slate-200/80' : '')
                      }
                      data-tip
                      data-for={'tooltipDefinition-' + index}
                      onMouseEnter={() => {
                        setFocusIndex(index);
                      }}
                      onMouseDown={() => {
                        let splitInputs = input.split(',');
                        splitInputs.pop();
                        splitInputs.push(key);
                        setInput(splitInputs.join(','));
                        setFocusIndex(0);
                      }}
                    >
                      <div className="truncate">{key}</div>
                    </div>
                    {index == focusIndex ? (
                      <ReactTooltip
                        id={'tooltipDefinition-' + index}
                        className="w-96 font-medium text-center"
                        place="left"
                        effect="solid"
                      >
                        {dataFieldDefinitions[parameter.definitionsId][key]}
                      </ReactTooltip>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div
        data-tip
        data-for={
          apiName + '-' + endpointName + '-' + parameter.name + '-tooltip'
        }
      >
        {isMounted ? (
          <ReactTooltip
            id={
              apiName + '-' + endpointName + '-' + parameter.name + '-tooltip'
            }
            className="max-w-sm font-medium font-default text-center"
            place="left"
            effect="solid"
          >
            {parameter.description}
          </ReactTooltip>
        ) : null}
        <FontAwesomeIcon
          className="ml-2 text-slate-400/50"
          icon={faCircleQuestion}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function useOutsideAlerter(ref, closeSidebar, stayOnScreen) {
  useEffect(() => {
    if (!stayOnScreen) {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          closeSidebar();
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        closeSidebar = null;
      };
    }
  }, [ref, stayOnScreen]);
}

export const dataFieldDefinitions = {
  strikes: {
    ticker: 'underlying symbol',
    tradeDate: 'trade date',
    expirDate: 'expiration date',
    dte: 'days to expiration',
    strike: 'option strike',
    stockPrice: 'stock price',
    callVolume: 'call option volume',
    callOpenInterest: 'call open interest',
    callBidSize: 'call bid size',
    callAskSize: 'call ask size',
    putVolume: 'put option volume',
    putOpenInterest: 'put open interest',
    putBidSize: 'put bid size',
    putAskSize: 'put ask size',
    callBidPrice: 'call bid price',
    callValue: 'call theoretical value based on smooth volatility',
    callAskPrice: 'call ask price',
    putBidPrice: 'put bid price',
    putValue: 'put theoretical value',
    putAskPrice: 'put ask price',
    callBidIv: 'call bid implied volatility',
    callMidIv: 'call mid implied volatility',
    callAskIv: 'call ask implied volatility',
    smvVol: 'ORATS final implied Volatility',
    putBidIv: 'put bid implied volatility',
    putMidIv: 'put mid implied volatility',
    putAskIv: 'put ask implied volatility',
    residualRate: 'implied interest rate data',
    delta: 'delta',
    gamma: 'gamma',
    theta: 'theta',
    vega: 'vega',
    rho: 'rho',
    phi: 'phi',
    driftlessTheta: 'time decay without taking in drift in underlying',
    extSmvVol: 'external volatility',
    extCallValue: 'external call theoretical price',
    extPutValue: 'external put theoretical price',
    spotPrice: 'spot price of the index',
    updatedAt: 'date and time of data updated',
  },
  moniesImplied: {
    ticker: 'underlying symbol',
    tradeDate: 'trade date',
    expirDate: 'expiration date',
    stockPrice: 'stock price',
    riskFreeRate: 'continuous interest (risk-free) rate',
    yieldRate: 'continuous dividend yield of discrete dividend’s NPV',
    residualYieldRate:
      'adjustment amount for the dividend yield at the .50 call delta -0.055 Implied rate means -5.5%.',
    residualRateSlp:
      'slope of the residual rate linear regression. A particular call delta total div yield = div yield + (cdelta - .5) * slope.',
    residualR2: 'r^2 of the residual rate linear regression',
    confidence:
      'portion of the delta range covered by market data (dependent on the width)',
    mwVol: 'ATM weighted market width in implied volatility terms',
    vol100: 'seed volatility at the 100 call delta',
    vol95: 'seed volatility at the 95 call delta',
    vol90: 'seed volatility at the 90 call delta',
    vol85: 'seed volatility at the 85 call delta',
    vol80: 'seed volatility at the 80 call delta',
    vol75: 'seed volatility at the 75 call delta',
    vol70: 'seed volatility at the 70 call delta',
    vol65: 'seed volatility at the 65 call delta',
    vol60: 'seed volatility at the 60 call delta',
    vol55: 'seed volatility at the 55 call delta',
    vol50: 'seed volatility at the 50 call delta',
    vol45: 'seed volatility at the 45 call delta',
    vol40: 'seed volatility at the 40 call delta',
    vol35: 'seed volatility at the 35 call delta',
    vol30: 'seed volatility at the 30 call delta',
    vol25: 'seed volatility at the 25 call delta',
    vol20: 'seed volatility at the 20 call delta',
    vol15: 'seed volatility at the 15 call delta',
    vol10: 'seed volatility at the 10 call delta',
    vol5: 'seed volatility at the 5 call delta',
    vol0: 'seed volatility at the 0 call delta',
    atmiv: 'implied volatility for month 1',
    slope:
      'best-fit regression line through the strike. volatilities adjusted to the tangent slope at the 50 delta.',
    deriv:
      'derivative or curvature of the monthly strikes at 28 day interpolated',
    fit: 'the at the money monthly fit volatility',
    spotPrice: 'spot price of the index',
    calVol: 'smoothed at-the-money term structure implied volatility',
    unadjVol:
      'smoothed at-the-money term structure implied volatility taking out the earnings effect',
    earnEffect: 'market implied earnings effect',
    updatedAt: 'date and time of data updated',
  },
  moniesForecast: {
    ticker: 'underlying symbol',
    tradeDate: 'trade date',
    expirDate: 'expiration date',
    stockPrice: 'stock price',
    riskFreeRate: 'continuous interest (risk-free) rate',
    vol100: 'seed volatility at the 100 call delta',
    vol95: 'seed volatility at the 95 call delta',
    vol90: 'seed volatility at the 90 call delta',
    vol85: 'seed volatility at the 85 call delta',
    vol80: 'seed volatility at the 80 call delta',
    vol75: 'seed volatility at the 75 call delta',
    vol70: 'seed volatility at the 70 call delta',
    vol65: 'seed volatility at the 65 call delta',
    vol60: 'seed volatility at the 60 call delta',
    vol55: 'seed volatility at the 55 call delta',
    vol50: 'seed volatility at the 50 call delta',
    vol45: 'seed volatility at the 45 call delta',
    vol40: 'seed volatility at the 40 call delta',
    vol35: 'seed volatility at the 35 call delta',
    vol30: 'seed volatility at the 30 call delta',
    vol25: 'seed volatility at the 25 call delta',
    vol20: 'seed volatility at the 20 call delta',
    vol15: 'seed volatility at the 15 call delta',
    vol10: 'seed volatility at the 10 call delta',
    vol5: 'seed volatility at the 5 call delta',
    vol0: 'seed volatility at the 0 call delta',
    updatedAt: 'date and time of data updated',
  },
  summaries: {
    ticker: 'underlying symbol',
    tradeDate: 'trade date',
    stockPrice: 'stock price',
    annActDiv: 'annual dividend from the next year of expected dividends',
    annIdiv: 'annual implied dividend given options prices put call parity',
    borrow30:
      'implied hard-to-borrow interest rate at 30 days to expiration given options prices put call parity',
    borrow2y:
      'implied hard-to-borrow interest rate at two years to expiration given options prices put call parity',
    confidence:
      'total weighted confidence from the monthly implied volatilities derived from each month’s number of options and bid ask width of the options markets',
    exErnIv10d:
      'implied 10 calendar day interpolated implied volatility with earnings effect out',
    exErnIv20d:
      'implied 20 calendar day interpolated implied volatility with earnings effect out',
    exErnIv30d:
      'implied 30 calendar day interpolated implied volatility with earnings effect out',
    exErnIv60d:
      'implied 60 calendar day interpolated implied volatility with earnings effect out',
    exErnIv90d:
      'implied 90 calendar day interpolated implied volatility with earnings effect out',
    exErnIv6m:
      'implied 6 month interpolated implied volatility with earnings effect out',
    exErnIv1y:
      'implied one year interpolated implied volatility with earnings effect out',
    ieeEarnEffect:
      'implied earnings effect (percentage of expected normal move) to make the best-fit term structure of the month implied volatilities',
    impliedMove:
      'percentage stock move in the implied earnings effect to make the best-fit term structure of the month implied volatilities',
    impliedNextDiv:
      'next implied dividend given options prices put call parity',
    iv10d: '10 calendar day interpolated implied volatility',
    iv20d: '20 calendar day interpolated implied volatility',
    iv30d: '30 calendar day interpolated implied volatility',
    iv60d: '60 calendar day interpolated implied volatility',
    iv90d: '90 calendar day interpolated implied volatility',
    iv6m: '6 month interpolated implied volatility',
    iv1y: 'one year interpolated implied volatility',
    mwAdj30:
      'ATM weighted market width in implied volatility terms interpolated to 30 calendar days to expiration',
    mwAdj2y:
      'ATM weighted market width in implied volatility terms interpolated to 2 years to expiration',
    nextDiv: 'next dividend amount',
    rDrv30:
      'derivative or curvature of the monthly strikes at 30 day interpolated. The derivative is the change in the slope for every 10 delta increase in the call delta',
    rDrv2y: 'derivative infinite implied',
    rSlp30:
      'best-fit regression line through the strike volatilities adjusted to the tangent slope at the 50 delta. The slope is the change in the implied volatility for every 10 delta increase in the call delta',
    rSlp2y: 'implied infinite slope',
    rVol30: 'implied volatility at 30 days interpolated',
    rVol2y: 'implied volatility at 2 year interpolated',
    rip: 'dollar amount of options to start ignoring in delta calculation',
    riskFree30:
      'continuous interest (risk-free) rate interpolated to 30 calendar days to expiration',
    riskFree2y:
      'continuous interest (risk-free) rate interpolated to 2 years to expiration',
    skewing:
      'Skewing is the difference between rVol30 and adjusted rVol2y where sqrtMinDays is 45 * 0.5. ((rVol30 - rVol2y * (1 - 1/sqrtMinDays)) * sqrtMinDays)',
    contango:
      'short-term contango of at-the-money implied volatilities ex-earnings',
    totalErrorConf:
      'total weighted squared error times the confidence in the monthly implied volatility',
    dlt5Iv10d: '10 calendar day interpolated implied volatility at the 5 delta',
    dlt5Iv20d: '20 calendar day interpolated implied volatility at the 5 delta',
    dlt5Iv30d: '30 calendar day interpolated implied volatility at the 5 delta',
    dlt5Iv60d: '60 calendar day interpolated implied volatility at the 5 delta',
    dlt5Iv90d: '90 calendar day interpolated implied volatility at the 5 delta',
    dlt5Iv6m: '180 calendar day interpolated implied volatility at the 5 delta',
    dlt5Iv1y: '365 calendar day interpolated implied volatility at the 5 delta',
    exErnDlt5Iv10d:
      '10 calendar day interpolated implied volatility at the 5 delta with earnings effects removed',
    exErnDlt5Iv20d:
      '20 calendar day interpolated implied volatility at the 5 delta with earnings effects removed',
    exErnDlt5Iv30d:
      '30 calendar day interpolated implied volatility at the 5 delta with earnings effects removed',
    exErnDlt5Iv60d:
      '60 calendar day interpolated implied volatility at the 5 delta with earnings effects removed',
    exErnDlt5Iv90d:
      '90 calendar day interpolated implied volatility at the 5 delta with earnings effects removed',
    exErnDlt5Iv6m:
      '180 calendar day interpolated implied volatility at the 5 delta with earnings effects removed',
    exErnDlt5Iv1y:
      '365 calendar day interpolated implied volatility at the 5 delta with earnings effects removed',
    dlt25Iv10d:
      '10 calendar day interpolated implied volatility at the 25 delta',
    dlt25Iv20d:
      '20 calendar day interpolated implied volatility at the 25 delta',
    dlt25Iv30d:
      '30 calendar day interpolated implied volatility at the 25 delta',
    dlt25Iv60d:
      '60 calendar day interpolated implied volatility at the 25 delta',
    dlt25Iv90d:
      '90 calendar day interpolated implied volatility at the 25 delta',
    dlt25Iv6m:
      '180 calendar day interpolated implied volatility at the 25 delta',
    dlt25Iv1y:
      '365 calendar day interpolated implied volatility at the 25 delta',
    exErnDlt25Iv10d:
      '10 calendar day interpolated implied volatility at the 25 delta with earnings effects removed',
    exErnDlt25Iv20d:
      '20 calendar day interpolated implied volatility at the 25 delta with earnings effects removed',
    exErnDlt25Iv30d:
      '30 calendar day interpolated implied volatility at the 25 delta with earnings effects removed',
    exErnDlt25Iv60d:
      '60 calendar day interpolated implied volatility at the 25 delta with earnings effects removed',
    exErnDlt25Iv90d:
      '90 calendar day interpolated implied volatility at the 25 delta with earnings effects removed',
    exErnDlt25Iv6m:
      '180 calendar day interpolated implied volatility at the 25 delta with earnings effects removed',
    exErnDlt25Iv1y:
      '365 calendar day interpolated implied volatility at the 25 delta with earnings effects removed',
    dlt75Iv10d:
      '10 calendar day interpolated implied volatility at the 75 delta',
    dlt75Iv20d:
      '20 calendar day interpolated implied volatility at the 75 delta',
    dlt75Iv30d:
      '30 calendar day interpolated implied volatility at the 75 delta',
    dlt75Iv60d:
      '60 calendar day interpolated implied volatility at the 75 delta',
    dlt75Iv90d:
      '90 calendar day interpolated implied volatility at the 75 delta',
    dlt75Iv6m:
      '180 calendar day interpolated implied volatility at the 75 delta',
    dlt75Iv1y:
      '365 calendar day interpolated implied volatility at the 75 delta',
    exErnDlt75Iv10d:
      '10 calendar day interpolated implied volatility at the 75 delta with earnings effects removed',
    exErnDlt75Iv20d:
      '20 calendar day interpolated implied volatility at the 75 delta with earnings effects removed',
    exErnDlt75Iv30d:
      '30 calendar day interpolated implied volatility at the 75 delta with earnings effects removed',
    exErnDlt75Iv60d:
      '40 calendar day interpolated implied volatility at the 75 delta with earnings effects removed',
    exErnDlt75Iv90d:
      '50 calendar day interpolated implied volatility at the 75 delta with earnings effects removed',
    exErnDlt75Iv6m:
      '180 calendar day interpolated implied volatility at the 75 delta with earnings effects removed',
    exErnDlt75Iv1y:
      '365 calendar day interpolated implied volatility at the 75 delta with earnings effects removed',
    dlt95Iv10d:
      '10 calendar day interpolated implied volatility at the 95 delta',
    dlt95Iv20d:
      '20 calendar day interpolated implied volatility at the 95 delta',
    dlt95Iv30d:
      '30 calendar day interpolated implied volatility at the 95 delta',
    dlt95Iv60d:
      '60 calendar day interpolated implied volatility at the 95 delta',
    dlt95Iv90d:
      '90 calendar day interpolated implied volatility at the 95 delta',
    dlt95Iv6m:
      '180 calendar day interpolated implied volatility at the 95 delta',
    dlt95Iv1y:
      '365 calendar day interpolated implied volatility at the 95 delta',
    exErnDlt95Iv10d:
      '10 calendar day interpolated implied volatility at the 95 delta with earnings effects removed',
    exErnDlt95Iv20d:
      '20 calendar day interpolated implied volatility at the 95 delta with earnings effects removed',
    exErnDlt95Iv30d:
      '30 calendar day interpolated implied volatility at the 95 delta with earnings effects removed',
    exErnDlt95Iv60d:
      '60 calendar day interpolated implied volatility at the 95 delta with earnings effects removed',
    exErnDlt95Iv90d:
      '90 calendar day interpolated implied volatility at the 95 delta with earnings effects removed',
    exErnDlt95Iv6m:
      '180 calendar day interpolated implied volatility at the 95 delta with earnings effects removed',
    exErnDlt95Iv1y:
      '365 calendar day interpolated implied volatility at the 95 delta with earnings effects removed',
    fwd30_20:
      'The forward volatility extracted from the 30 day and 20 day implied volatility',
    fwd60_30:
      'The forward volatility extracted from the 60 day and 30 day implied volatility',
    fwd90_60:
      'The forward volatility extracted from the 90 day and 60 day implied volatility',
    fwd180_90:
      'The forward volatility extracted from the 180 day and 90 day implied volatility',
    fwd90_30:
      'The forward volatility extracted from the 90 day and 30 day implied volatility',
    fexErn30_20:
      'The forward ex-earnings volatility extracted from the 30 day and 20 day implied ex-earnings volatility',
    fexErn60_30:
      'The forward ex-earnings volatility extracted from the 60 day and 30 day implied ex-earnings volatility',
    fexErn90_60:
      'The forward ex-earnings volatility extracted from the 90 day and 60 day implied ex-earnings volatility',
    fexErn180_90:
      'The forward ex-earnings volatility extracted from the 180 day and 90 day implied ex-earnings volatility',
    fexErn90_30:
      'The forward ex-earnings volatility extracted from the 90 day and 30 day implied ex-earnings volatility',
    ffwd30_20:
      'The flat forward volatility extracted from the 30 day and 20 day implied volatility',
    ffwd60_30:
      'The flat forward volatility extracted from the 60 day and 30 day implied volatility',
    ffwd90_60:
      'The flat forward volatility extracted from the 90 day and 60 day implied volatility',
    ffwd180_90:
      'The flat forward volatility extracted from the 180 day and 90 day implied volatility',
    ffwd90_30:
      'The flat forward volatility extracted from the 90 day and 30 day implied volatility',
    ffexErn30_20:
      'The flat forward ex-earnings volatility extracted from the 30 day and 20 day implied ex-earnings volatility',
    ffexErn60_30:
      'The flat forward ex-earnings volatility extracted from the 60 day and 30 day implied ex-earnings volatility',
    ffexErn90_60:
      'The flat forward ex-earnings volatility extracted from the 90 day and 60 day implied ex-earnings volatility',
    ffexErn180_90:
      'The flat forward ex-earnings volatility extracted from the 180 day and 90 day implied ex-earnings volatility',
    ffexErn90_30:
      'The flat forward ex-earnings volatility extracted from the 90 day and 30 day implied ex-earnings volatility',
    fbfwd30_20:
      'The flat forward volatility divided by the forward volatility both extracted from the 30 day and 20 day implied volatility',
    fbfwd60_30:
      'The flat forward volatility divided by the forward volatility both extracted from the 60 day and 30 day implied volatility',
    fbfwd90_60:
      'The flat forward volatility divided by the forward volatility both extracted from the 90 day and 60 day implied volatility',
    fbfwd180_90:
      'The flat forward volatility divided by the forward volatility both extracted from the 180 day and 90 day implied volatility',
    fbfwd90_30:
      'The flat forward volatility divided by the forward volatility both extracted from the 90 day and 30 day implied volatility',
    fbfexErn30_20:
      'The flat forward ex-earnings volatility divided by the forward ex-earnings volatility both extracted from the 30 day and 20 day implied ex-earnings volatility',
    fbfexErn60_30:
      'The flat forward ex-earnings volatility divided by the forward ex-earnings volatility both extracted from the 60 day and 30 day implied ex-earnings volatility',
    fbfexErn90_60:
      'The flat forward ex-earnings volatility divided by the forward ex-earnings volatility both extracted from the 90 day and 60 day implied ex-earnings volatility',
    fbfexErn180_90:
      'The flat forward ex-earnings volatility divided by the forward ex-earnings volatility both extracted from the 180 day and 90 day implied ex-earnings volatility',
    fbfexErn90_30:
      'The flat forward ex-earnings volatility divided by the forward ex-earnings volatility both extracted from the 90 day and 30 day implied ex-earnings volatility',
    impliedEarningsMove:
      'percentage stock move in the implied earnings effect to make the best-fit term structure of the month implied volatilities',
    updatedAt: 'date and time of data updated',
  },
  cores: {
    ticker: 'underlying symbol',
    tradeDate: 'trade date',
    assetType:
      'characterizes stock as easy-to-borrow (ETB), hard-to-borrow (HTB), dividend paying, stock ETF or Index with these codes: 0 - ETB_NO_DIV 1 - HTB 2 - HTB_DIV_PAYING 3 - ETB_DIV_PAYING 4 - INDEX 5 - ETF 6 - VIX_STYLE_EX 7 - ETF_QDIV_ON_EX 8 - ETF_MDIV_ON_EX 9 - INDEX_AMER_EX',
    priorCls: 'closing price on the prior trading day',
    pxAtmIv: 'stock price taken at time of IV calculation',
    mktCap:
      'market capitalization (shares outstanding * stock price) (in 000s)',
    cVolu:
      'today’s call option volume for all strikes for the current trading day',
    cOi: 'total call open interest',
    pVolu: 'today’s put option volume for all strikes',
    pOi: 'total put open interest',
    orFcst20d:
      'ORATS forecast of stock volatility for the next 20 days based on data with earnings taken out. The forecasts of the next 20 trading days of statistical/historical volatility are developed using short term ex-earnings historical volatility; ex earnings implied volatility and the IV HV relationships, related ETF HV IV relationships',
    orIvFcst20d:
      'ORATS forecast of implied volatility in 20 days with earnings taken out. Could be compared to ORATS 20d IV implied volatility.The forecasts of the implied volatility in 20 trading days are developed using ex-earnings historical volatility; ex earnings implied volatility and the IV HV relationships, related ETF HV IV relationships',
    orFcstInf:
      'ORATS forecast of the infinite implied volatility. Could be compared to actual implied volatility or actual infinite. The forecasts of the two year implied volatility are developed using long term ex-earnings historical volatility, ex-earnings implied volatility and the IV HV relationships, related ETF HV IV relationships',
    orIvXern20d:
      '20 business day interpolated implied option volatility with earnings effect taken out (orIvXern)',
    orIvXernInf:
      'ORATS long term implied volatility parameter solve of term structure at 2 year out with 30 calendar day parameter and earnings effect out',
    iv200Ma:
      '200 day moving average of the ORATS 20day ex-earn implied volatility',
    atmIvM1: 'implied volatility for the first standard expiration',
    atmFitIvM1:
      'the at-the-money monthly fit volatility for month 1 using the term structure of the forecast and the implied at-the-money volatility',
    atmFcstIvM1:
      'forecast of volatility for month 1 using the ex-earnings forecast plus the earnings effect at this days to expiration',
    dtExM1:
      'days to expiration in month 1 standard expiration (not weekly or quarterly expirations)',
    atmIvM2: 'implied volatility for month 2',
    atmFitIvM2: 'at-the-money monthly fit volatility for month 2',
    atmFcstIvM2: 'forecast of volatility for month 2',
    dtExM2: 'days to expiration in month 2',
    atmIvM3: 'implied volatility for month 3',
    atmFitIvM3: 'at-the-money monthly fit volatility for month 3',
    atmFcstIvM3: 'forecast of volatility for month 3',
    dtExM3: 'days to expiration in month 3',
    atmIvM4: 'implied volatility for month 4',
    atmFitIvM4: 'at-the-money monthly fit volatility for month 4',
    atmFcstIvM4: 'forecast of volatility for month 4',
    dtExM4: 'days to expiration in month 4',
    iRate5wk: 'short term risk-free interest rate from treasuries',
    iRateLt: 'long term risk-free interest rate from treasuries',
    px1kGam: 'estimated cost of 1000 gamma per day for 30-day options',
    volOfVol:
      'annualized standard deviation of daily (1day ORATS intraday vol) statistical volatility for one year',
    volOfIvol:
      'annualized standard deviation of the ORATS ex-earnings 30 day implied.',
    slope:
      'best-fit regression line through the strike volatilities adjusted to the tangent slope at the 50 delta. The slope is the change in the implied volatility for every 10 delta increase in the call delta',
    slopeInf: 'implied infinite slope',
    slopeFcst:
      'ORATS forecast of the slope of implied volatility skew. Could be compared to the actual slope',
    slopeFcstInf: 'slope forecast infinite',
    deriv:
      'derivative or curvature of the monthly strikes at 30 day interpolated. The derivative is the change in the slope for every 10 delta increase in the call delta',
    derivInf: 'derivative infinite implied',
    derivFcst: 'forecast derivative at 30 day interpolated',
    derivFcstInf: 'forecast infinite derivative',
    mktWidthVol:
      'market width in implied vol points at the interpolated 30 days to expiration',
    mktWidthVolInf:
      'market width in implied vol points at the interpolated 2 years to expiration',
    cAddPrem: 'deprecated item.',
    pAddPrem: 'deprecated item.',
    rip: 'dollar amount of options to start ignoring in delta calculation',
    ivEarnReturn:
      'average of the volatility day of and day after earnings / implied day before divided by implied day before / implied day after',
    fcstR2:
      'goodness of fit of the 20-day forecast to the 20-day future statistical volatility',
    fcstR2Imp:
      'goodness of fit of the implied forecast vs actual implied in 20 days',
    hiHedge: 'deprecated item',
    loHedge: 'deprecated item',
    stkVolu: 'total stock volume for an underlyer',
    avgOptVolu20d:
      'average for the last 20 days of total options volume for the symbol',
    sector: 'sector as derived by cusip number',
    orHv1d: '1-day historical intraday volatility',
    orHv5d: '5-day historical intraday volatility',
    orHv10d: '10-day historical intraday volatility',
    orHv20d: '20-day historical intraday volatility',
    orHv60d: '60-day historical intraday volatility',
    orHv90d: '90-day historical intraday volatility',
    orHv120d: '120-day historical intraday volatility',
    orHv252d: '252-day historical intraday volatility',
    orHv500d: '500-day historical intraday volatility',
    orHv1000d: '1000-day historical intraday volatility',
    clsHv5d: '5-day historical close to close volatility',
    clsHv10d: '10-day historical close to close volatility',
    clsHv20d: '20-day historical close to close volatility',
    clsHv60d: '60-day historical close to close volatility',
    clsHv90d: '90-day historical close to close volatility',
    clsHv120d: '120-day historical close to close volatility',
    clsHv252d: '252-day historical close to close volatility',
    clsHv500d: '500-day historical close to close volatility',
    clsHv1000d: '1000-day historical close to close volatility',
    iv20d: '20 calendar day interpolated implied volatility',
    iv30d: '30 calendar day interpolated implied volatility',
    iv60d: '60 calendar day interpolated implied volatility',
    iv90d: '90 calendar day interpolated implied volatility',
    iv6m: '6 month interpolated implied volatility',
    clsPx1w: 'stock price at the prior week (5 trading days ago)',
    stkPxChng1wk: 'stock price change over the prior week (5 trading days)',
    clsPx1m: 'stock price at the prior month (21 trading days ago)',
    stkPxChng1m: 'stock price change over the prior month (21 trading days)',
    clsPx6m: 'stock price at the prior 6 months (252/2) trading days ago',
    stkPxChng6m:
      'stock price change over the prior 6 months (252/2) trading days',
    clsPx1y: 'stock price at the prior year (252 trading days ago)',
    stkPxChng1y: 'stock price change over the prior year (252 trading days)',
    divFreq: 'number of dividends per year',
    divYield: 'annualized dividends divided by stock price',
    divGrwth: 'slope of the forecasted dividends annualized',
    divDate: 'next dividend date is available through another subscription',
    divAmt: 'dividend amount.',
    nextErn: 'next earnings date is available through another subscription',
    nextErnTod: 'deprecated item',
    lastErn: 'last earnings date',
    lastErnTod:
      'time of day earnings released: Before-2, After-3, During-4, Unknown-1',
    absAvgErnMv:
      'average Earnings Move percentage: an average of the absolute values of the stock price moves corresponding to the time of the next earnings announcement',
    impliedIee:
      'market implied earnings effect is found by solving for a term structure equation where the earnings effects adjust the months affected by earnings',
    daysToNextErn: 'deprecated item.',
    tkOver: '0 - Not a takeover. 1 - A takeover or rumored takeover stock',
    etfIncl: 'ETFs where the symbol is a component pipe delimited if multiple',
    bestEtf: 'closest SPDR Sector ETF (default to SPY or RUT if none)',
    sectorName: 'short name of the sector',
    correlSpy1m:
      'ORATS 30 day implied volatility ex-earnings (orIvXern) correlation with SPY one month',
    correlSpy1y:
      'ORATS 30 day implied volatility ex-earnings (orIvXern) correlation with SPY one year',
    correlEtf1m:
      'orIvXern correlation with the Best ETF 30 day IV over the last month',
    correlEtf1y:
      'orIvXern correlation with the SPDR Sector ETF 30 day IV over the last year',
    beta1m: 'short term price beta with SPY for 30 calendar days',
    beta1y: 'long term price beta, 365 calendar days',
    ivPctile1m: 'percentile of the current orIvXern vs. month range',
    ivPctile1y: 'percentile of the current orIvXern vs. year range',
    ivPctileSpy: 'percentile of the current orIvXern / SPY vs. year range',
    ivPctileEtf: 'percentile of the current ETF orIvXern vs. year range',
    ivStdvMean: 'number of stdevs the orIvXern is away from mean for the year',
    ivStdv1y: 'standard deviation of the orIvXern for the year',
    ivSpyRatio: 'orIvXern divided by SPY 30 day ORATS implied volatility',
    ivSpyRatioAvg1m:
      'orIvXern divided by SPY 30 day ORATS implied volatility 30 day average',
    ivSpyRatioAvg1y:
      'orIvXern divided by SPY 30 day ORATS implied volatility one year average',
    ivSpyRatioStdv1y:
      'orIvXern divided by SPY 30 day ORATS implied volatility one year standard deviation',
    ivEtfRatio: 'orIvXern divided by ETF 30 day ORATS implied volatility',
    ivEtfRatioAvg1m:
      'orIvXern divided by ETF 30 day ORATS implied volatility 30 day average',
    ivEtfRatioAvg1y:
      'orIvXern divided by ETF 30 day ORATS implied volatility one year average',
    ivEtFratioStdv1y:
      'orIvXern divided by ETF 30 day ORATS implied volatility one year standard deviation',
    ivHvXernRatio: 'orIvXern / orHvXern20d Ratio',
    ivHvXernRatio1m: 'orIvXern / orHvXern20d Ratio vs monthly average',
    ivHvXernRatio1y: 'orIvXern / orHvXern20d Ratio vs yearly average',
    ivHvXernRatioStdv1y:
      'orIvXern / orHvXern20d Ratio vs yearly range standard deviation',
    etfIvHvXernRatio:
      'orIvXern / orHvXern20d Ratio divided by ETF 30day implied / orHv20d ratio.',
    etfIvHvXernRatio1m:
      'orIvXern / orHvXern20d Ratio divided by ETF 30day implied / orHv20d ratio month average.',
    etfIvHvXernRatio1y:
      'orIvXern / orHvXern20d Ratio divided by ETF 30day implied / orHv20d ratio year average',
    etfIvHvXernRatioStdv1y:
      'orIvXern / orHvXern20d Ratio divided by ETF 30day implied / orHv20d ratio year standard deviation',
    slopepctile: 'one-year percentile for the slope',
    slopeavg1m: 'slope average for trailing month',
    slopeavg1y: 'slope average for trailing year',
    slopeStdv1y: 'standard deviation of the Slope',
    etfSlopeRatio: 'slope divided by ETF slope current',
    etfSlopeRatioAvg1m: 'slope divided by ETF slope month average',
    etfSlopeRatioAvg1y: 'slope divided by ETF slope year average',
    etfSlopeRatioAvgStdv1y:
      'slope divided by ETF slope year standard deviation',
    impliedR2:
      'regression formula goodness of fit of the 30 day ORATS implied volatility to the 20 day future statistical ex-earnings volatility',
    contango:
      'short-term contango of at-the-money implied volatilities ex-earnings',
    nextDiv: 'next dividend amount',
    impliedNextDiv:
      'next implied dividend given options prices put call parity',
    annActDiv: 'annual dividend from the next year of expected dividends',
    annIdiv: 'annual implied dividend given options prices put call parity',
    borrow30:
      'implied hard-to-borrow interest rate at 30 days to expiration given options prices put call parity',
    borrow2yr:
      'implied hard-to-borrow interest rate at two years to expiration given options prices put call parity',
    error:
      'total weighted squared error times the confidence in the monthly implied volatility',
    confidence:
      'total weighted confidence from the monthly implied volatilities derived from each month’s number of options and bid ask width of the options markets',
    pxCls: 'underlying price at the last close',
    wksNextErn:
      'weeks to the next earnings is available through another subscription',
    nextErnTod: 'deprecated item',
    ernMnth: 'deprecated item',
    avgOptVolu20d:
      'average option volume for all strikes over the last 20 days',
    oi: 'total open interest for all strikes.',
    atmIvM1:
      'at-the-money implied volatility for month 1 interpolated using strikes weighted to at-the-money',
    dtExM1: 'days to expiration for month 1',
    atmIvM2: 'at-the-money implied volatility for month 2',
    dtExm2: 'Days to expiration for month 2',
    atmIvM3: 'at-the-money implied volatility for month 3',
    dtExM3: 'days to expiration for month 3',
    atmIvM4: 'at-the-money implied volatility for month 4',
    dtExM4: 'days to expiration for month 4',
    straPxM1: 'straddle price for month 1 closest to the money strikes',
    straPxM2: 'straddle price for month 2',
    smoothStraPxM1:
      'straddle ORATS smooth theo for month 1 based on a smoothed line through all strikes',
    smoothStrPxM2: 'straddle ORATS smooth theo for month 2',
    fcstStraPxM1: 'straddle ORATS Forecast theo for month 1',
    fcstStraPxM2: 'straddle ORATS Forecast theo for month 2',
    loStrikeM1: 'low strike of the straddle or strangle for month 1',
    hiStrikeM1: 'high strike of the straddle or strangle for month 1',
    loStrikeM2: 'low strike of the straddle or strangle for month 2',
    hiStrikeM2: 'high strike of the straddle or strangle for month 2',
    ernDate1: 'historical earnings date back 1',
    ernDate2: 'historical earnings date back 2',
    ernDate3: 'historical earnings date back 3',
    ernDate4: 'historical earnings date back 4',
    ernDate5: 'historical earnings date back 5',
    ernDate6: 'historical earnings date back 6',
    ernDate7: 'historical earnings date back 7',
    ernDate8: 'historical earnings date back 8',
    ernDate9: 'historical earnings date back 9',
    ernDate10: 'historical earnings date back 10',
    ernDate11: 'historical earnings date back 11',
    ernDate12: 'historical earnings date back 12',
    ernMv1: 'percentage move for earnings date back 1',
    ernMv2: 'percentage move for earnings date back 2',
    ernMv3: 'percentage move for earnings date back 3',
    ernMv4: 'percentage move for earnings date back 4',
    ernMv5: 'percentage move for earnings date back 5',
    ernMv6: 'percentage move for earnings date back 6',
    ernMv7: 'percentage move for earnings date back 7',
    ernMv8: 'percentage move for earnings date back 8',
    ernMv9: 'percentage move for earnings date back 9',
    ernMv10: 'percentage move for earnings date back 10',
    ernMv11: 'percentage move for earnings date back 11',
    ernMv12: 'percentage move for earnings date back 12',
    ernStraPct1:
      'earn straddle price as a percent of the stock price for earnings date number 1',
    ernStraPct2:
      'earn straddle price as a percent of the stock price for earnings date number 2',
    ernStraPct3:
      'earn straddle price as a percent of the stock price for earnings date number 3',
    ernStraPct4:
      'earn straddle price as a percent of the stock price for earnings date number 4',
    ernStraPct5:
      'earn straddle price as a percent of the stock price for earnings date number 5',
    ernStraPct6:
      'earn straddle price as a percent of the stock price for earnings date number 6',
    ernStraPct7:
      'earn straddle price as a percent of the stock price for earnings date number 7',
    ernStraPct8:
      'earn straddle price as a percent of the stock price for earnings date number 8',
    ernStraPct9:
      'earn straddle price as a percent of the stock price for earnings date number 9',
    ernStraPct10:
      'earn straddle price as a percent of the stock price for earnings date number 10',
    ernStraPct11:
      'earn straddle price as a percent of the stock price for earnings date number 11',
    ernStraPct12:
      'earn straddle price as a percent of the stock price for earnings date number 12',
    ernEffct1: 'earn effect for earnings date number 1',
    ernEffct2: 'earn effect for earnings date number 2',
    ernEffct3: 'earn effect for earnings date number 3',
    ernEffct4: 'earn effect for earnings date number 4',
    ernEffct5: 'earn effect for earnings date number 5',
    ernEffct6: 'earn effect for earnings date number 6',
    ernEffct7: 'earn effect for earnings date number 7',
    ernEffct8: 'earn effect for earnings date number 8',
    ernEffct9: 'earn effect for earnings date number 9',
    ernEffct10: 'earn effect for earnings date number 10',
    ernEffct11: 'earn effect for earnings date number 11',
    ernEffct12: 'earn effect for earnings date number 12',
    orHv5d: '5-day historical intraday volatility',
    orHv10d: '10-day historical intraday volatility',
    orHv20d: '20-day historical intraday volatility',
    orHv60d: '60-day historical intraday volatility',
    orHv90d: '90-day historical intraday volatility',
    orHv120d: '120-day historical intraday volatility',
    orHv252d: '252-day historical intraday volatility',
    orHv500d: '500-day historical intraday volatility',
    orHv1000d: '1000-day historical intraday volatility',
    orHvXern5d:
      '5-day historical intraday volatility excluding day of and after earnings (5 observations less day of or day after earnings if applicable)',
    orHvXern10d:
      '10-day historical intraday volatility excluding day of and after earnings',
    orHvXern20d:
      '20-day historical intraday volatility excluding day of and after earnings',
    orHvXern60d:
      '60-day historical intraday volatility excluding day of and after earnings',
    orHvXern90d:
      '90-day historical intraday volatility excluding day of and after earnings',
    orHvXern120d:
      '120-day historical intraday volatility excluding day of and after earnings',
    orHvXern252d:
      '252-day historical intraday volatility excluding day of and after earnings',
    orHvXern500d:
      '500-day historical intraday volatility excluding day of and after earnings',
    orHvXern1000d:
      '1000-day historical intraday volatility excluding day of and after earnings',
    clsHv5d: '5-day historical close to close volatility',
    clsHv10d: '10-day historical close to close volatility',
    clsHv20d: '20-day historical close to close volatility',
    clsHv60d: '60-day historical close to close volatility',
    clsHv90d: '90-day historical close to close volatility',
    clsHv120d: '120-day historical close to close volatility',
    clsHv252d: '252-day historical close to close volatility',
    clsHv500d: '500-day historical close to close volatility',
    clsHv1000d: '1000-day historical close to close volatility',
    clsHvXern5d:
      '5-day historical close to close volatility excluding day of and after earnings',
    clsHvXern10d:
      '10-day historical close to close volatility excluding day of and after earnings',
    clsHvXern20d:
      '20-day historical close to close volatility excluding day of and after earnings',
    clsHvXern60d:
      '60-day historical close to close volatility excluding day of and after earnings',
    clsHvXern90d:
      '90-day historical close to close volatility excluding day of and after earnings',
    clsHvXern120d:
      '120-day historical close to close volatility excluding day of and after earnings',
    clsHvXern252d:
      '252-day historical close to close volatility excluding day of and after earnings',
    clsHvXern500d:
      '500-day historical close to close volatility excluding day of and after earnings',
    clsHvXern1000d:
      '1000-day historical close to close volatility excluding day of and after earnings',
    iv10d: '10 calendar day interpolated implied volatility',
    iv20d: '20 calendar day interpolated implied volatility',
    iv30d: '30 calendar day interpolated implied volatility',
    iv60d: '60 calendar day interpolated implied volatility',
    iv90d: '90 calendar day interpolated implied volatility',
    iv6m: '6 month interpolated implied volatility',
    iv1yr: '1 year interpolated implied volatility',
    slope:
      'put call slope at the interpolated 30 calendar days of the tangent at 50 delta',
    fcstSlope: 'ORATS forecasted 30 calendar day put/call slope',
    fcstErnEffct:
      'ORATS forecasted earnings effect considers day of and day after earnings, seasonality, recentness, median and average of move divided by expected move',
    absAvgErnMv:
      'absolute average percent earnings move 12 observations at the time of the historical earnings announcement',
    ernMvStdv: 'standard deviation of the 12 earnings moves absolute values',
    impliedEe:
      'The implied earnings effect (percentage of expected normal move) to make the best-fit term structure of the month implied volatilities',
    impErnMv:
      'percentage stock move in the implied earnings effect to make the best-fit term structure of the month implied volatilities',
    impMth2ErnMv:
      'percentage stock move in the implied earnings effect to make the best-fit term structure of the month implied volatilities',
    fairVol90d: 'IV of the first earnings month',
    fairXieeVol90d:
      'smoothed term structure ex-earnings Ivs at the front earnings month plus the solved earnings effect',
    fairMth2XieeVol90d:
      '30 calendar day interpolated implied volatility with earnings effect out plus the additional IV earnings effect from the first earnings month',
    impErnMv90d:
      'additional IV the front earnings month has over its ex-earnings IV',
    impErnMvMth290d:
      'additional IV the second earnings month has over its ex-earnings IV',
    exErnIv10d:
      'implied 10 calendar day interpolated implied volatility with earnings effect out',
    exErnIv20d:
      'implied 20 calendar day interpolated implied volatility with earnings effect out',
    exErnIv30d:
      'implied 30 calendar day interpolated implied volatility with earnings effect out',
    exErnIv60d:
      'implied 60 calendar day interpolated implied volatility with earnings effect out',
    exErnIv90d:
      'implied 90 calendar day interpolated implied volatility with earnings effect out',
    exErnIv6m:
      'implied 6 month interpolated implied volatility with earnings effect out',
    exErnIv1yr:
      'implied 1 year interpolated implied volatility with earnings effect out',
    updatedAt: 'date and time of data updated',
  },
  dailyPrice: {
    ticker: 'underlying symbol',
    tradeDate: 'trade date',
    clsPx: 'closing stock price adjusted for splits and dividends',
    hiPx: 'high of day stock price adjusted for splits and dividends',
    loPx: 'low of day stock price adjusted for splits and dividends',
    open: 'opening stock price adjusted for splits and dividends',
    stockVolume:
      'total stock volume of the day adjusted for splits and dividends',
    unadjClsPx: 'unadjusted closing stock price',
    unadjHiPx: 'unadjusted high of day stock price',
    unadjLoPx: 'unadjusted low of day stock price',
    unadjOpen: 'unadjusted opening stock price',
    unadjStockVolume: 'unadjusted total stock volume of the day',
    updatedAt: 'date and time of data updated',
  },
  historicalVolatility: {
    ticker: 'underlying symbol',
    tradeDate: 'trade date',
    orHv1d: '1-day historical intraday volatility',
    orHv5d: '5-day historical intraday volatility',
    orHv10d: '10-day historical intraday volatility',
    orHv20d: '20-day historical intraday volatility',
    orHv30d: '30-day historical intraday volatility',
    orHv60d: '60-day historical intraday volatility',
    orHv90d: '90-day historical intraday volatility',
    orHv100d: '100-day historical intraday volatility',
    orHv120d: '120-day historical intraday volatility',
    orHv252d: '252-day historical intraday volatility',
    orHv500d: '500-day historical intraday volatility',
    orHv1000d: '1000-day historical intraday volatility',
    clsHv5d: '5-day historical close to close volatility',
    clsHv10d: '10-day historical close to close volatility',
    clsHv20d: '20-day historical close to close volatility',
    clsHv30d: '30-day historical close to close volatility',
    clsHv60d: '60-day historical close to close volatility',
    clsHv90d: '90-day historical close to close volatility',
    clsHv100d: '100-day historical close to close volatility',
    clsHv120d: '120-day historical close to close volatility',
    clsHv252d: '252-day historical close to close volatility',
    clsHv500d: '500-day historical close to close volatility',
    clsHv1000d: '1000-day historical close to close volatility',
    orHvXern5d:
      '5-day historical intraday volatility excluding day of and after earnings',
    orHvXern10d:
      '10-day historical intraday volatility excluding day of and after earnings',
    orHvXern20d:
      '20-day historical intraday volatility excluding day of and after earnings',
    orHvXern30d:
      '30-day historical intraday volatility excluding day of and after earnings',
    orHvXern60d:
      '460-day historical intraday volatility excluding day of and after earnings',
    orHvXern90d:
      '90-day historical intraday volatility excluding day of and after earnings',
    orHvXern100d:
      '100-day historical intraday volatility excluding day of and after earnings',
    orHvXern120d:
      '120-day historical intraday volatility excluding day of and after earnings',
    orHvXern252d:
      '252-day historical intraday volatility excluding day of and after earnings',
    orHvXern500d:
      '500-day historical intraday volatility excluding day of and after earnings',
    orHvXern1000d:
      '1000-day historical intraday volatility excluding day of and after earnings',
    clsHvXern5d:
      '5-day historical close to close volatility excluding day of and after earnings',
    clsHvXern10d:
      '10-day historical close to close volatility excluding day of and after earnings',
    clsHvXern20d:
      '20-day historical close to close volatility excluding day of and after earnings',
    clsHvXern30d:
      '30-day historical close to close volatility excluding day of and after earnings',
    clsHvXern60d:
      '60-day historical close to close volatility excluding day of and after earnings',
    clsHvXern90d:
      '90-day historical close to close volatility excluding day of and after earnings',
    clsHvXern100d:
      '100-day historical close to close volatility excluding day of and after earnings',
    clsHvXern120d:
      '120-day historical close to close volatility excluding day of and after earnings',
    clsHvXern252d:
      '252-day historical close to close volatility excluding day of and after earnings',
    clsHvXern500d:
      '500-day historical close to close volatility excluding day of and after earnings',
    clsHvXern1000d:
      '1000-day historical close to close volatility excluding day of and after earnings',
  },
  dividendHistory: {
    ticker: 'underlying symbol',
    exDate: 'ex-dividend date',
    divAmt: 'dividend amount',
    divFreq: 'dividend frequency per year',
    declaredDate: 'declared dividend date',
  },
  earningsHistory: {
    ticker: 'underlying symbol',
    earnDate: 'earnings date',
    anncTod:
      'time of day earnings released: Before=900, After=1630, During=1200, Unknown=2359',
    updatedAt: 'date and time of data updated',
  },
  stockSplitHistory: {
    ticker: 'underlying symbol',
    splitDate: 'stock split date',
    divisor: 'ratio of stock split',
  },
  ivRank: {
    ticker: 'underlying symbol',
    tradeDate: 'trade date',
    iv: 'implied volatility at 30 days interpolated',
    ivRank1m:
      'A measure of implied volatility vs its past 1 month values, but it looks only at the highest and lowest values. Formula is (Current IV - 1 month Low IV) / (1 month Max - 1 month Min)',
    ivPct1m:
      'A measure of implied volatility vs its past 1 month values. If IV percentile is 36% – It means that current IV value is higher than 36% of previous 1 month values (and lower than 64% of them).',
    ivRank1y:
      'A measure of implied volatility vs its 1 year past values, but it looks only at the highest and lowest values. Formula is (Current IV - 1 yr Low IV) / (1 yr Max - 1 yr Min)',
    ivPct1y:
      'A measure of implied volatility vs its past 1 year values. If IV percentile is 36% – It means that current IV value is higher than 36% of previous 1 year values (and lower than 64% of them).',
    updatedAt: 'date and time of data updated',
  },
};
