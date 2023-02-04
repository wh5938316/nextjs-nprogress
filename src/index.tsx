"use client";

import Router from 'next/router';
import * as NProgress from 'nprogress';
import * as PropTypes from 'prop-types';
import * as React from 'react';

export default function NextNProgress({
  color = '#29D',
  startPosition = 0.3,
  stopDelayMs = 200,
  height = 3,
  showOnShallow = true,
  options,
  nonce,
}: {
  /**
   * The color of the bar.
   * @default "#29D"
   */
  color?: string;
  /**
   * The start position of the bar.
   * @default 0.3
   */
  startPosition?: number;
  /**
   * The stop delay in milliseconds.
   * @default 200
   */
  stopDelayMs?: number;
  /**
   * The height of the bar.
   * @default 3
   */
  height?: number;
  /**
   * Whether to show the bar on shallow routes.
   * @default true
   */
  showOnShallow?: boolean;
  /**
   * The other NProgress configuration options to pass to NProgress.
   * @default null
   */
  options?: Partial<NProgress.NProgressOptions>;
  /**
   * The nonce attribute to use for the `style` tag.
   * @default undefined
   */
  nonce?: string;
}) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  React.useEffect(() => {
    if (options) {
      NProgress.configure(options);
    }
    Router.events.on('routeChangeStart', routeChangeStart);
    Router.events.on('routeChangeComplete', routeChangeEnd);
    Router.events.on('routeChangeError', routeChangeError);
    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
      Router.events.off('routeChangeComplete', routeChangeEnd);
      Router.events.off('routeChangeError', routeChangeError);
    };
  }, []);

  const routeChangeStart = (
    _: string,
    {
      shallow,
    }: {
      shallow: boolean;
    }
  ) => {
    if (!shallow || showOnShallow) {
      NProgress.set(startPosition);
      NProgress.start();
    }
  };

  const routeChangeEnd = (
    _: string,
    {
      shallow,
    }: {
      shallow: boolean;
    }
  ) => {
    if (!shallow || showOnShallow) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        NProgress.done(true);
      }, stopDelayMs);
    }
  };

  const routeChangeError = (
    _err: Error,
    _url: string,
    {
      shallow,
    }: {
      shallow: boolean;
    }
  ) => {
    if (!shallow || showOnShallow) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        NProgress.done(true);
      }, stopDelayMs);
    }
  };

  return (
    <style nonce={nonce}>{`:root{--nprogress-color:${color};--nprogress-height:${height}px;}`}</style>
  );
}

NextNProgress.propTypes = {
  color: PropTypes.string,
  startPosition: PropTypes.number,
  stopDelayMs: PropTypes.number,
  height: PropTypes.number,
  showOnShallow: PropTypes.bool,
  options: PropTypes.object,
  nonce: PropTypes.string,
};