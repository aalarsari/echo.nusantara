import prisma from "@/database/prisma";
import { HttpStatusCode } from "@/lib/enum/statusCode/statusCode";
import { authOptions } from "@/lib/nextAuth/auth";
import { ProductValidation } from "@/lib/zod-schema/product";
import { Prisma } from "@prisma/client";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import slugify from "react-slugify";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { CreateLocationAttachment } from "@/lib/attachment";
import {
  AscDescValidation,
  NameOrderByValidation,
} from "@/lib/zod-schema/user";
import moment from "moment-timezone";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  var body = await request.formData();

  try {
    var validation = ProductValidation.parse(body);

    var slug = slugify(validation.name);

    var checkProduct = await prisma.products.findFirst({
      where: {
        slug: slug,
        deleteAt: null,
        deleteBy: null,
      },
    });

    if (checkProduct) {
      return NextResponse.json(
        {
          error: true,
          message: "Product already exist",
          data: null,
        },
        {
          status: HttpStatusCode.BadRequest,
        },
      );
    }

    const directoryPath = CreateLocationAttachment(1);
    if (validation.image2 === "undefined") {
      validation.image2 = null;
    }
    if (validation.image3 === "undefined") {
      validation.image3 = null;
    }
    if (validation.image4 === "undefined") {
      validation.image4 = null;
    }
    if (validation.image5 === "undefined") {
      validation.image5 = null;
    }

    var image1 = validation.image1 as File;
    var imageBuffer1 = Buffer.from(await image1.arrayBuffer());
    var imageName1 = image1.name.replace(/ /g, "-");
    await writeFile(
      path.join(process.cwd(), `${directoryPath}/${imageName1}`),
      imageBuffer1 as unknown as Uint8Array,
    );

    if (validation.image2) {
      var image2 = validation.image2 as File;
      var imageBuffer2 = Buffer.from(await image2.arrayBuffer());
      var imageName2 = image2.name.replaceAll(" ", "-");
      await writeFile(
        path.join(process.cwd(), `${directoryPath}/${imageName2}`),
        imageBuffer2 as unknown as Uint8Array,
      );
    }

    if (validation.image3) {
      var image3 = validation.image3 as File;
      var imageBuffer3 = Buffer.from(await image3.arrayBuffer());
      var imageName3 = image3.name.replaceAll(" ", "-");
      await writeFile(
        path.join(process.cwd(), `${directoryPath}/${imageName3}`),
        imageBuffer3 as unknown as Uint8Array,
      );
    }

    if (validation.image4) {
      var image4 = validation.image4 as File;
      var imageBuffer4 = Buffer.from(await image4.arrayBuffer());
      var imageName4 = image4.name.replaceAll(" ", "-");
      await writeFile(
        path.join(process.cwd(), `${directoryPath}/${imageName4}`),
        imageBuffer4 as unknown as Uint8Array,
      );
    }

    if (validation.image5) {
      var image5 = validation.image5 as File;
      var imageBuffer5 = Buffer.from(await image5.arrayBuffer());
      var imageName5 = image5.name.replaceAll(" ", "-");
      await writeFile(
        path.join(process.cwd(), `${directoryPath}/${imageName5}`),
        imageBuffer5 as unknown as Uint8Array,
      );
    }

    // kalo productnya di delete

    var checkProduct = await prisma.products.findFirst({
      where: {
        slug: slug,
        deleteAt: {
          not: null,
        },
        deleteBy: {
          not: null,
        },
      },
    });

    if (checkProduct) {
      var product = await prisma.products.update({
        where: {
          id: checkProduct.id,
        },
        data: {
          deleteAt: null,
          deleteBy: null,
          name: validation.name!,
          descriptions: validation.descriptions,
          subDescriptions: validation.subDescriptions,
          priceIDR: validation.priceIDR,
          weight: validation.weight!,
          maxOrder: validation.maxOrder!,
          stock: validation.stock!,
          categoryId: validation.categoryId,
          image1: `${process.env.APP_URL}/static/attachment/product/images/${imageName1}`,
          image2:
            imageName2! != null
              ? `${process.env.APP_URL}/static/attachment/product/images/${imageName2}`
              : null,
          image3:
            imageName3! != null
              ? `${process.env.APP_URL}/static/attachment/product/images/${imageName3}`
              : null,
          image4:
            imageName4! != null
              ? `${process.env.APP_URL}/static/attachment/product/images/${imageName4}`
              : null,
          image5:
            imageName5! != null
              ? `${process.env.APP_URL}/static/attachment/product/images/${imageName5}`
              : null,
          size: validation.size!,
          updateAt: moment.tz().format(),
          updateBy: session?.user.name,
        },
      });
    } else {
      var product = await prisma.products.create({
        data: {
          name: validation.name,
          slug: slug,
          descriptions: validation.descriptions,
          priceIDR: validation.priceIDR,
          weight: validation.weight,
          stock: validation.stock,
          subDescriptions: validation.subDescriptions,
          maxOrder: validation.maxOrder,
          recommendation: validation.recommendation!,
          categoryId: validation.categoryId,
          image1: `${process.env.APP_URL}/static/attachment/product/images/${imageName1}`,
          image2:
            imageName2! != null
              ? `${process.env.APP_URL}/static/attachment/product/images/${imageName2}`
              : null,
          image3:
            imageName3! != null
              ? `${process.env.APP_URL}/static/attachment/product/images/${imageName3}`
              : null,
          image4:
            imageName4! != null
              ? `${process.env.APP_URL}/static/attachment/product/images/${imageName4}`
              : null,
          image5:
            imageName5! != null
              ? `${process.env.APP_URL}/static/attachment/product/images/${imageName5}`
              : null,
          size: validation.size!,
          createdAt: moment.tz().format(),
          updateAt: moment.tz().format(),
          updateBy: session?.user.name,
          createdBy: session?.user.name,
        },
      });
    }

    // ubah kembali dari string -> null

    return NextResponse.json({
      error: false,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationError = fromZodError(err);
      return NextResponse.json(
        {
          error: true,
          message: null,
          data: validationError,
        },
        {
          status: HttpStatusCode.UnprocessableEntity,
        },
      );
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          error: true,
          message: null,
          data: err,
        },
        {
          status: HttpStatusCode.BadRequest,
        },
      );
    }
  }
}

export async function GET(request: NextRequest) {
  var page: any = request.nextUrl.searchParams.get("page")!;
  var pageSize: any = request.nextUrl.searchParams.get("pageSize");
  var pageSizeInt = parseInt(pageSize);

  var searchP: string = request.nextUrl.searchParams.get("search")!;

  var orderBy = request.nextUrl.searchParams.get("orderBy");
  var nameOrderBy = request.nextUrl.searchParams.get("nameOrderBy");

  var orderByValidation = AscDescValidation.safeParse(orderBy);
  var validationNameOrderBy = NameOrderByValidation.safeParse(nameOrderBy);

  var search: any = {
    name: {
      mode: "insensitive",
      contains: searchP,
    },
  };
  if (
    searchP.length == 0 ||
    searchP == "undifined" ||
    searchP == null ||
    searchP == undefined
  ) {
    search = {};
  }

  var filter: any = (filter = {
    orderBy: {
      name: orderByValidation.data!,
    },
  });

  if (validationNameOrderBy.data == "price") {
    filter = {
      orderBy: {
        price: orderByValidation.data!,
      },
    };
  } else if (validationNameOrderBy.data == "stock") {
    filter = {
      orderBy: {
        stock: orderByValidation.data!,
      },
    };
  }

  var productTotal = await prisma.products.count({
    where: {
      deleteAt: null,
      deleteBy: null,
      ...search,
    },
  });

  var products = await prisma.products.findMany({
    where: {
      deleteAt: null,
      deleteBy: null,
      ...search,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      stock: true,
      categoryId: true,
      size: true,
      updateAt: true,
      priceIDR: true,
      Discount: true,
    },
    ...filter,
    take: pageSizeInt,
    skip: (page - 1) * pageSize,
    orderBy: {
      updateAt: "desc",
    },
  });

  var data = {
    products: products,
    productTotal: productTotal,
  };

  return NextResponse.json({
    error: false,
    message: null,
    data: data,
  });
}
