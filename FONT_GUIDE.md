# Custom Fonts Guide

This project uses three custom fonts: **Inter** (sans-serif), **Noto Serif** (serif), and **Source Code Pro** (monospace).

## Font Families

### 1. Inter (Sans-serif)

- **Use case**: Primary UI text, headings, body text
- **Characteristics**: Modern, highly legible, designed for user interfaces
- **Weights**: 100-900 (variable font)

### 2. Noto Serif (Serif)

- **Use case**: Long-form content, articles, elegant headings
- **Characteristics**: Traditional serif design, excellent readability
- **Weights**: 200-900 (variable font)

### 3. Source Code Pro (Monospace)

- **Use case**: Code snippets, technical content, data display
- **Characteristics**: Clean monospace font, optimized for code
- **Weights**: 200-900 (variable font)

## Usage Methods

### Method 1: SCSS Mixins (Recommended)

```scss
// In your component's SCSS file
.my-heading {
  @include font-sans(bold, xl, md);
}

.my-content {
  @include font-serif(regular, md, sm);
}

.my-code {
  @include font-mono(medium, sm, xs);
}
```

### Method 2: Utility Classes

```html
<!-- Typography classes -->
<h1 class="text-sans-2xl font-bold">Main Heading</h1>
<h2 class="text-serif-xl font-semibold">Sub Heading</h2>
<p class="text-sans-md font-regular">Body text</p>
<code class="text-mono-sm font-medium">Code snippet</code>

<!-- Font family utilities -->
<div class="font-sans">Sans-serif text</div>
<div class="font-serif">Serif text</div>
<div class="font-mono">Monospace text</div>

<!-- Font weight utilities -->
<div class="font-thin">Thin text</div>
<div class="font-light">Light text</div>
<div class="font-regular">Regular text</div>
<div class="font-medium">Medium text</div>
<div class="font-semibold">Semi-bold text</div>
<div class="font-bold">Bold text</div>
<div class="font-extrabold">Extra bold text</div>
<div class="font-black">Black text</div>
```

### Method 3: CSS Variables

```scss
.my-component {
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 20px;
}
```

## Available Sizes

- `xs`: 12px
- `sm`: 14px
- `md`: 16px
- `lg`: 20px
- `xl`: 24px
- `2xl`: 32px
- `3xl`: 40px
- `4xl`: 48px

## Available Weights

- `thin`: 100
- `light`: 300
- `regular`: 400
- `medium`: 500
- `semi-bold`: 600
- `bold`: 700
- `extra-bold`: 800
- `black`: 900

## Best Practices

1. **Use Inter for UI elements**: Buttons, navigation, forms, etc.
2. **Use Noto Serif for content**: Articles, blog posts, long-form text
3. **Use Source Code Pro for code**: Code blocks, technical documentation
4. **Maintain hierarchy**: Use consistent size and weight combinations
5. **Consider readability**: Don't use very light weights on small text

## Examples

### Navigation

```html
<nav class="text-sans-md font-medium">
  <a href="#" class="text-sans-sm font-regular">Home</a>
</nav>
```

### Article Content

```html
<article>
  <h1 class="text-serif-2xl font-bold">Article Title</h1>
  <p class="text-serif-md font-regular">Article content...</p>
</article>
```

### Code Display

```html
<pre class="text-mono-sm font-medium">
  <code>const example = "code";</code>
</pre>
```

## Performance Notes

- All fonts use `font-display: swap` for better loading performance
- Variable fonts are used to reduce file size
- Fonts are loaded from local assets for faster loading
