# Horizontal Scroll Gallery - Grid System

## The Grid

A **20×20 grid** creates 400 cells:

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(20, 100px);  /* 20 columns, 100px each = 2000px wide */
  grid-template-rows: repeat(20, 1fr);       /* 20 rows, equal height, fills viewport */
}
```

```
       col1   col2   col3   col4   col5   col6  ...  col20
      ┌──────┬──────┬──────┬──────┬──────┬──────┬───┬──────┐
  r1  │ 1,1  │ 2,1  │ 3,1  │ 4,1  │ 5,1  │ 6,1  │   │20,1  │
  r2  │ 1,2  │ 2,2  │ 3,2  │ 4,2  │ 5,2  │ 6,2  │   │20,2  │
  r3  │ 1,3  │ 2,3  │ 3,3  │ 4,3  │ 5,3  │ 6,3  │   │20,3  │
  r4  │ 1,4  │ 2,4  │ 3,4  │ 4,4  │ 5,4  │ 6,4  │   │20,4  │
  ...
  r20 │ 1,20 │ 2,20 │ 3,20 │ 4,20 │ 5,20 │ 6,20 │   │20,20 │
      └──────┴──────┴──────┴──────┴──────┴──────┴───┴──────┘
```

Cell labels show `column,row` — use these coordinates to place images.

---

## Placing Images

Every image needs two properties:

```css
.item-1 {
  grid-column: [start] / [end];
  grid-row: [start] / [end];
}
```

**Important:** The end value is *exclusive* — the image stops *before* that line.

### Examples

```css
/* Wide landscape - 6 columns × 3 rows */
.item-1 {
  grid-column: 2 / 8;    /* columns 2,3,4,5,6,7 */
  grid-row: 1 / 4;       /* rows 1,2,3 */
}

/* Tall portrait - 3 columns × 10 rows */
.item-2 {
  grid-column: 10 / 13;  /* columns 10,11,12 */
  grid-row: 5 / 15;      /* rows 5,6,7,8,9,10,11,12,13,14 */
}

/* Large square - 5 columns × 6 rows */
.item-3 {
  grid-column: 15 / 20;  /* columns 15,16,17,18,19 */
  grid-row: 8 / 14;      /* rows 8,9,10,11,12,13 */
}

/* Single column allowed */
.item-4 {
  grid-column: 5;        /* just column 5 */
  grid-row: 2 / 8;       /* rows 2-7 */
}
```

### Quick Reference

| What You Want | Column | Row |
|--------------|--------|-----|
| Top-left | `2 / 6` | `1 / 5` |
| Top-right | `16 / 20` | `1 / 5` |
| Bottom-left | `2 / 6` | `16 / 20` |
| Bottom-right | `16 / 20` | `16 / 20` |
| Center | `8 / 13` | `8 / 13` |
| Full height left | `2 / 5` | `1 / 21` |
| Full width top | `1 / 21` | `1 / 4` |

---

## Creating Shapes

**Width** = number of columns spanned  
**Height** = number of rows spanned

| Shape | Columns | Rows | Example |
|-------|---------|------|---------|
| Wide landscape | 5-8 | 2-4 | `grid-column: 2/8; grid-row: 1/4` |
| Tall portrait | 2-4 | 6-10 | `grid-column: 3/6; grid-row: 10/20` |
| Square | equal | equal | `grid-column: 5/10; grid-row: 5/10` |
| Small | 2-3 | 2-3 | `grid-column: 8/10; grid-row: 3/5` |
| Large hero | 5-6 | 6-8 | `grid-column: 10/15; grid-row: 3/11` |

---

## Spacing & Overlap Rules

1. **Empty columns = whitespace** — skip column numbers to create horizontal gaps
2. **Empty rows = vertical gaps** — leave row numbers unused
3. **Images can't overlap** — each image must occupy unique cells
4. **Edges don't touch** — leave at least 1 row/column between images

**Bad (touching edges):**
```css
.item-1 { grid-column: 2/5; grid-row: 1/5; }
.item-2 { grid-column: 5/8; grid-row: 1/5; }  /* starts where item-1 ends */
```

**Good (gap between):**
```css
.item-1 { grid-column: 2/5; grid-row: 1/5; }
.item-2 { grid-column: 6/9; grid-row: 1/5; }  /* 1 column gap */
```

---

## Debug Mode

Set `DEBUG = true` in App.jsx to see coordinates on every cell:

```
┌──────┬──────┬──────┐
│ 1,1  │ 2,1  │ 3,1  │
├──────┼──────┼──────┤
│ 1,2  │ 2,2  │ 3,2  │
└──────┴──────┴──────┘
```

Use these to pick your `grid-column` and `grid-row` values, then turn debug off.

---

## Scroll Behavior

The gallery is inside a container that converts vertical scroll to horizontal:

1. **Container height** = viewport + gallery scroll width
2. **Gallery sticks** to top while you scroll through the container
3. **Scroll progress** directly maps to horizontal position

```
Vertical scroll 0px    → Gallery at left edge
Vertical scroll 500px  → Gallery scrolled 500px right
Vertical scroll max    → Gallery at right edge, continue to next page
```

---

## Current Layout

```css
.item-1 { grid-column: 2 / 8;   grid-row: 1 / 8;   }  /* top-left, wide */
.item-2 { grid-column: 10 / 15; grid-row: 3 / 11;  }  /* center, large */
.item-3 { grid-column: 3 / 6;   grid-row: 10 / 20; }  /* bottom-left, tall */
.item-4 { grid-column: 8 / 12;  grid-row: 14 / 19; }  /* bottom-center */
.item-5 { grid-column: 14 / 19; grid-row: 13 / 19; }  /* bottom-right, wide */
.item-6 { grid-column: 17 / 20; grid-row: 2 / 10;  }  /* top-right, tall */
```

Visual:
```
       2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20
    ┌─────────────────────────────┐                                            ┌─────────────────┐
 1  │                             │                                            │                 │
 2  │          IMG 1              │                                            │                 │
 3  │                             │              ┌────────────────────┐        │      IMG 6      │
 4  │                             │              │                    │        │                 │
 5  └─────────────────────────────┘              │                    │        │                 │
 6                                               │       IMG 2        │        │                 │
 7                                               │                    │        │                 │
 8                                               │                    │        │                 │
 9                                               └────────────────────┘        └─────────────────┘
10  ┌──────────────┐                                                                              
11  │              │                                                                              
12  │              │                                                                              
13  │    IMG 3     │                             ┌─────────────────────────┐                      
14  │              │         ┌───────────────┐   │                         │                      
15  │              │         │               │   │        IMG 5            │                      
16  │              │         │    IMG 4      │   │                         │                      
17  │              │         │               │   │                         │                      
18  │              │         └───────────────┘   └─────────────────────────┘                      
19  └──────────────┘                                                                              
```

---

## Adding More Images

1. Add image to the `images` array in App.jsx
2. Add CSS rule `.item-7 { grid-column: X / Y; grid-row: X / Y; }`
3. Use debug mode to find empty cells
4. Make sure no overlap with existing images
