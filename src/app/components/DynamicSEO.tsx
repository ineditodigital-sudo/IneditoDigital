import { useEffect } from 'react';
import { useLocation } from 'react-router';

interface DynamicSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  type?: string;
  author?: string;
  schema?: any;
}

/**
 * Componente SEO mejorado que aplica la configuración del panel de administración
 */
export default function DynamicSEO({
  title,
  description,
  keywords = [],
  image,
  canonical,
  noindex = false,
  nofollow = false,
  type = 'website',
  author,
  schema
}: DynamicSEOProps) {
  const location = useLocation();
  
  // Cargar configuración guardada del admin
  const globalSEO = JSON.parse(localStorage.getItem('inedito_seo_global') || '{}');
  const pageSEOArray = JSON.parse(localStorage.getItem('inedito_seo_pages') || '[]');
  const schemaConfig = JSON.parse(localStorage.getItem('inedito_seo_schema') || '{}');
  
  // Buscar SEO específico de la página actual
  const currentPageSEO = pageSEOArray.find((page: any) => page.path === location.pathname);
  
  // Usar configuración del admin si existe, sino usar props
  const finalTitle = currentPageSEO?.title || title || 'INÉDITO DIGITAL';
  const finalDescription = currentPageSEO?.description || description || '';
  const finalKeywords = currentPageSEO?.keywords || keywords;
  const finalImage = currentPageSEO?.ogImage || image || globalSEO.defaultImage || 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp';
  const finalCanonical = currentPageSEO?.canonical || canonical || `https://www.inedito.digital${location.pathname}`;
  const finalNoindex = currentPageSEO?.noindex ?? noindex;
  const finalNofollow = currentPageSEO?.nofollow ?? nofollow;
  const siteName = globalSEO.siteName || 'INÉDITO DIGITAL';
  const fullTitle = finalTitle.includes(siteName) ? finalTitle : `${finalTitle} | ${siteName}`;

  useEffect(() => {
    // Set document title
    document.title = fullTitle;

    // Meta tags básicos
    const metaTags = [
      { name: 'description', content: finalDescription },
      { name: 'keywords', content: finalKeywords.join(', ') },
      
      // Open Graph
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: finalDescription },
      { property: 'og:image', content: finalImage },
      { property: 'og:url', content: finalCanonical },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: siteName },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: finalDescription },
      { name: 'twitter:image', content: finalImage },
      { name: 'twitter:site', content: globalSEO.twitterHandle || '@ineditodigital' },
      
      // Robots
      { 
        name: 'robots', 
        content: `${finalNoindex ? 'noindex' : 'index'}, ${finalNofollow ? 'nofollow' : 'follow'}` 
      },
      { 
        name: 'googlebot', 
        content: `${finalNoindex ? 'noindex' : 'index'}, ${finalNofollow ? 'nofollow' : 'follow'}` 
      },
    ];

    // Author
    if (author || globalSEO.author) {
      metaTags.push({ name: 'author', content: author || globalSEO.author });
      metaTags.push({ property: 'article:author', content: author || globalSEO.author });
    }

    // Facebook App ID
    if (globalSEO.fbAppId) {
      metaTags.push({ property: 'fb:app_id', content: globalSEO.fbAppId });
    }

    // Google Site Verification
    if (globalSEO.googleSiteVerification) {
      metaTags.push({ name: 'google-site-verification', content: globalSEO.googleSiteVerification });
    }

    // Bing Site Verification
    if (globalSEO.bingVerification) {
      metaTags.push({ name: 'msvalidate.01', content: globalSEO.bingVerification });
    }

    // Aplicar meta tags
    metaTags.forEach(({ name, property, content }) => {
      if (!content) return;
      
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let element = document.querySelector(selector);
      
      if (!element) {
        element = document.createElement('meta');
        if (name) element.setAttribute('name', name);
        if (property) element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    });

    // Canonical link
    let canonical_element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical_element) {
      canonical_element = document.createElement('link');
      canonical_element.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical_element);
    }
    canonical_element.setAttribute('href', finalCanonical);

    // Schema.org JSON-LD
    const finalSchema = schema || (schemaConfig.organizationName ? {
      '@context': 'https://schema.org',
      '@type': schemaConfig.organizationType || 'LocalBusiness',
      name: schemaConfig.organizationName,
      image: finalImage,
      url: 'https://www.inedito.digital',
      telephone: schemaConfig.phone,
      email: schemaConfig.email,
      priceRange: schemaConfig.priceRange,
      address: {
        '@type': 'PostalAddress',
        streetAddress: schemaConfig.address,
        addressLocality: schemaConfig.city,
        addressRegion: schemaConfig.state,
        postalCode: schemaConfig.zip,
        addressCountry: 'MX'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: parseFloat(schemaConfig.latitude || '21.8853'),
        longitude: parseFloat(schemaConfig.longitude || '-102.2916')
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      },
      sameAs: [
        schemaConfig.socialMedia?.facebook,
        schemaConfig.socialMedia?.instagram,
        schemaConfig.socialMedia?.linkedin
      ].filter(Boolean)
    } : null);

    if (finalSchema) {
      let schemaScript = document.querySelector('script[type="application/ld+json"][data-page-schema]');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('type', 'application/ld+json');
        schemaScript.setAttribute('data-page-schema', 'true');
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(finalSchema);
    }

    // Google Analytics
    if (globalSEO.googleAnalytics && !document.querySelector(`script[src*="${globalSEO.googleAnalytics}"]`)) {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${globalSEO.googleAnalytics}`;
      document.head.appendChild(gaScript);

      const gaConfigScript = document.createElement('script');
      gaConfigScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${globalSEO.googleAnalytics}');
      `;
      document.head.appendChild(gaConfigScript);
    }

    // Facebook Pixel
    if (globalSEO.facebookPixel && !document.querySelector(`script[data-fb-pixel]`)) {
      const fbScript = document.createElement('script');
      fbScript.setAttribute('data-fb-pixel', 'true');
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${globalSEO.facebookPixel}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);

      const fbNoScript = document.createElement('noscript');
      fbNoScript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${globalSEO.facebookPixel}&ev=PageView&noscript=1"/>`;
      document.body.appendChild(fbNoScript);
    }
  }, [
    fullTitle, 
    finalDescription, 
    finalKeywords, 
    finalImage, 
    finalCanonical, 
    finalNoindex, 
    finalNofollow, 
    type, 
    author, 
    schema,
    globalSEO,
    schemaConfig
  ]);

  return null;
}
