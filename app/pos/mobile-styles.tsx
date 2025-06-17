"use client"

import { useEffect } from "react"

export function MobileOptimizations() {
  useEffect(() => {
    // Prevent zoom on input focus for iOS Safari
    const addViewportMeta = () => {
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no")
      }
    }

    // Add touch-friendly styles
    const addMobileStyles = () => {
      const style = document.createElement("style")
      style.textContent = `
        /* iOS Safari specific fixes */
        @supports (-webkit-touch-callout: none) {
          .touch-manipulation {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -webkit-tap-highlight-color: transparent;
          }
        }
        
        /* Smooth scrolling for mobile */
        .overflow-y-auto {
          -webkit-overflow-scrolling: touch;
        }
        
        /* Better button press feedback */
        .cursor-pointer:active {
          transform: scale(0.98);
          transition: transform 0.1s ease;
        }
        
        /* Prevent text selection on buttons */
        button, .cursor-pointer {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        /* Mobile-specific input styling */
        @media (max-width: 768px) {
          input[type="text"], input[type="number"], select {
            font-size: 16px !important; /* Prevents zoom on iOS */
          }
          
          .mobile-scroll {
            max-height: calc(100vh - 200px);
          }
        }
        
        /* Improve touch targets */
        @media (pointer: coarse) {
          button, .cursor-pointer {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `
      document.head.appendChild(style)
    }

    addViewportMeta()
    addMobileStyles()
  }, [])

  return null
}
